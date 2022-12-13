const Users = require("../models/userModel")
const { CLIENT_URL } = process.env
const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2022-08-01",
})

const subsController = {
	stripePrices: async (req, res) => {
		try {
			const prices = await stripe.prices.list({
				apiKey: process.env.STRIPE_SECRET_KEY,
			})

			return res.json(prices)
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	stripeSession: async (req, res) => {
		const { email, priceId } = req.body
		try {
			const user = await Users.findOne({ email })
			const session = await stripe.checkout.sessions.create(
				{
					mode: "subscription",
					payment_method_types: ["card"],
					line_items: [
						{
							price: priceId,
							quantity: 1,
						},
					],
					success_url: `${CLIENT_URL}/`,
					cancel_url: `${CLIENT_URL}/`,
					customer: user.stripeCustomerId,
				},
				{
					apiKey: process.env.STRIPE_SECRET_KEY,
				}
			)

			return res.json(session)
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	stripeUserPayment: async (req, res) => {
		const { stripeCustomerId } = req.body
		try {
			const subscription = await stripe.subscriptions.list(
				{
					customer: stripeCustomerId,
					status: "all",
					expand: ["data.default_payment_method"],
				},
				{
					apiKey: process.env.STRIPE_SECRET_KEY,
				}
			)

			if (subscription.data.length < 0) {
				res.json("No plan")
			} else {
				let plan = []
				for (i = 0; i < subscription.data.length; i++) {
					plan.push(subscription.data[i].plan.nickname)
				}
				res.json(plan)
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
}

module.exports = subsController
