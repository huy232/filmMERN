const Users = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sendMail = require("./sendMail")
const { CLIENT_URL } = process.env
const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2022-08-01",
})

const userController = {
	register: async (req, res) => {
		try {
			const { name, email, password } = req.body

			if (!name || !email || !password)
				return res.status(400).json({ msg: "Please fill in all fields." })

			if (!validateEmail(email))
				return res.status(400).json({ msg: "Invalid emails." })

			const user = await Users.findOne({ email })
			if (user)
				return res.status(400).json({ msg: "This email already exists." })

			if (password.length < 6)
				return res
					.status(400)
					.json({ msg: "Password must be at least 6 characters." })

			const passwordHash = await bcrypt.hash(password, 12)

			const newUser = {
				name,
				email,
				password: passwordHash,
			}

			const activation_token = createActivationToken(newUser)

			const url = `${CLIENT_URL}/user/activate/${activation_token}`

			sendMail(email, url, "Verify your email address")

			res.json({
				msg: "Register Success! Please activate your email to start.",
			})
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	activeEmail: async (req, res) => {
		try {
			const { activation_token } = req.body
			const user = jwt.verify(
				activation_token,
				process.env.ACTIVATION_TOKEN_SECRET
			)

			const { name, email, password } = user

			const check = await Users.findOne({ email })
			if (check)
				return res.status(400).json({ msg: "This email is already exist" })

			const stripeCustomer = await stripe.customers.create(
				{
					email,
				},
				{
					apiKey: process.env.STRIPE_SECRET_KEY,
				}
			)

			const newUser = new Users({
				name,
				email,
				password,
				stripeCustomerId: stripeCustomer.id,
			})

			await newUser.save()

			res.json({ msg: "Account has been activated" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	login: async (req, res) => {
		try {
			const { email, password } = req.body
			const user = await Users.findOne({ email })
			if (!user)
				return res.status(400).json({ msg: "This email doesn't exist" })
			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch)
				return res.status(400).json({ msg: "Password is incorrect" })
			const refresh_token = createRefreshToken({ id: user._id })
			res.cookie("refreshtoken", refresh_token, {
				httpOnly: true,
				path: "user/refresh-token",
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			})
			res.json({ msg: "Login Success" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	getAccessToken: async (req, res) => {
		try {
			const refresh_token = req.cookies.refreshtoken
			if (!refresh_token) return res.status(400).json({ msg: "Please login!" })

			jwt.verify(
				refresh_token,
				process.env.REFRESH_TOKEN_SECRET,
				(err, user) => {
					if (err) return res.status(400).json({ msg: "Please login!" })
					const access_token = createAccessToken({ id: user.id })
					res.json({ access_token })
				}
			)
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	forgotPassword: async (req, res) => {
		try {
			const { email } = req.body
			const user = await Users.findOne({ email })
			if (!user)
				return res.status(400).json({ msg: "This email doesn't exist" })

			const access_token = createAccessToken({ id: user._id })
			const url = `${CLIENT_URL}/user/reset/${access_token}`

			sendMail(email, url, "Reset your password")
			res.json({ msg: "Re-send the password, please check your email again" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	resetPassword: async (req, res) => {
		try {
			const { password } = req.body
			const passwordHash = await bcrypt.hash(password, 12)
			await Users.findOneAndUpdate(
				{ _id: req.user.id },
				{
					password: passwordHash,
				}
			)

			res.json({ msg: "Password successfully changed" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	getUserInformation: async (req, res) => {
		try {
			const user = await Users.findById(req.user.id).select("-password")

			res.json(user)
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	getAllUserInformation: async (req, res) => {
		try {
			const users = await Users.find().select("-password")
			res.json(users)
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	logout: async (req, res) => {
		try {
			res.clearCookie("refreshtoken", { path: "user/refresh-token" })
			return res.json({ msg: "Logged out" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	updateUser: async (req, res) => {
		try {
			const { name, avatar } = req.body
			await Users.findOneAndUpdate(
				{ _id: req.user.id },
				{
					name,
					avatar,
				}
			)
			res.json({ msg: "Update success" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	updateUserRole: async (req, res) => {
		try {
			const { role } = req.body
			await Users.findOneAndUpdate(
				{ _id: req.params.id },
				{
					role,
				}
			)
			res.json({ msg: "Update success" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	deleteUser: async (req, res) => {
		try {
			await Users.findByIdAndDelete(req.params.id)

			res.json({ msg: "Delete success" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	googleLogin: async (req, res) => {
		try {
			const { decoded } = req.body
			const { picture, email_verified, name, email } = decoded
			const password = email + process.env.GOOGLE_SECRET
			const passwordHash = await bcrypt.hash(password, 12)
			if (!email_verified)
				return res.status(400).json({ msg: "Email verification failed" })

			const user = await Users.findOne({ email })
			if (user) {
				const isMatch = await bcrypt.compare(password, user.password)
				if (!isMatch)
					return res.status(400).json({ msg: "Password is incorrect" })

				const refresh_token = createRefreshToken({ id: user._id })
				res.cookie("refreshtoken", refresh_token, {
					httpOnly: true,
					path: "user/refresh-token",
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				})
				res.json({ msg: "Login Success" })
			} else {
				const stripeCustomer = await stripe.customers.create(
					{
						email,
					},
					{
						apiKey: process.env.STRIPE_SECRET_KEY,
					}
				)

				const newUser = new Users({
					name,
					email,
					password: passwordHash,
					avatar: picture,
					stripeCustomerId: stripeCustomer.id,
				})
				await newUser.save()
				const refresh_token = createRefreshToken({ id: newUser._id })
				res.cookie("refreshtoken", refresh_token, {
					httpOnly: true,
					path: "user/refresh-token",
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				})
				res.json({ msg: "Login Success" })
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	updateHistory: async (req, res) => {
		const { _id, filmId } = req.body

		try {
			await Users.updateOne(
				{ _id },
				{
					$push: {
						bookmark: {
							filmId,
						},
					},
				}
			)
			res.json({ msg: "Success add trailer" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	deleteHistory: async (req, res) => {
		const { _id, filmId } = req.body
		try {
			await Users.updateOne(
				{
					_id,
				},
				{
					$pull: { bookmark: { filmId } },
				},
				{ new: true }
			)
			res.json({ msg: "Success delete bookmark" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	watchHistory: async (req, res) => {
		const { _id, filmId, currentTime, episodeId } = req.body
		try {
			const response = await Users.updateOne(
				{ _id, "history.filmId": filmId },
				{
					$set: {
						"history.$.currentTime": currentTime,
						"history.$.episodeId": episodeId,
					},
				}
			)

			if (response.matchedCount === 0) {
				await Users.updateOne(
					{ _id },
					{
						$push: {
							history: {
								filmId,
								currentTime,
							},
						},
					}
				)
			}

			res.json({ msg: "Update history" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
}

const validateEmail = (email) => {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	)
}

const createActivationToken = (payload) => {
	return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
		expiresIn: "5m",
	})
}

const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "1d",
	})
}

const createRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	})
}

module.exports = userController
