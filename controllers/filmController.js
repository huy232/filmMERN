const Users = require("../models/userModel")
const Films = require("../models/filmModel")
const { CLIENT_URL } = process.env
const { toSlug } = require("../utils/index")
const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2022-08-01",
})

const ITEMS_PER_PAGE = 2

const filmController = {
	createFilm: async (req, res) => {
		const {
			filmName,
			filmDescription,
			type,
			genres,
			filmBanner,
			filmImage,
			episode,
		} = req.body

		const filmSlug = toSlug(filmName)

		if (!filmSlug || !filmName || !type || genres.length == 0)
			return res
				.status(400)
				.json({ msg: "Please fill in all the requirement for film" })

		const filmCheck = await Films.findOne({ filmName })
		if (filmCheck)
			return res.status(400).json({ msg: "This film is already exist" })

		if (type !== "series" && type !== "movie") {
			return res
				.status(400)
				.json({ msg: "Type format must be movie or series only" })
		}

		const newFilm = new Films({
			filmName,
			filmSlug,
			filmDescription,
			type,
			genres,
			filmBanner,
			filmImage,
			episode,
		})

		newFilm.save()

		return res.json({ msg: "Successful create a film" })
	},
	getMovies: async (req, res) => {
		const { filmName } = req.query || ""
		const page = req.query.page || 1

		const query = {
			type: "movie",
			filmName: { $regex: `${filmName}`, $options: "i" },
		}

		try {
			const skip = (page - 1) * ITEMS_PER_PAGE
			const count = await Films.countDocuments(query)
			const films = await Films.find(query).limit(ITEMS_PER_PAGE).skip(skip)
			const pageCount = Math.ceil(count / ITEMS_PER_PAGE)

			if (films.length === 0) {
				res.json({
					films: "",
					pagination: {
						count: 0,
						pageCount: 1,
					},
				})
			} else {
				res.json({
					films: films,
					pagination: {
						count,
						pageCount,
					},
				})
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	getSeries: async (req, res) => {
		const { filmName } = req.query || ""
		const page = req.query.page || 1

		const query = {
			type: "series",
			filmName: { $regex: `${filmName}`, $options: "i" },
		}

		try {
			const skip = (page - 1) * ITEMS_PER_PAGE
			const count = await Films.countDocuments(query)
			const films = await Films.find(query).limit(ITEMS_PER_PAGE).skip(skip)
			const pageCount = Math.ceil(count / ITEMS_PER_PAGE)

			if (films.length === 0) {
				res.json({
					films: "",
					pagination: {
						count: 0,
						pageCount: 1,
					},
				})
			} else {
				res.json({
					films: films,
					pagination: {
						count,
						pageCount,
					},
				})
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	getFilm: async (req, res) => {
		const { _id } = req.params

		try {
			const specificFilm = await Films.findById(_id)
			return res.json({
				film: specificFilm,
			})
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	addEpisode: async (req, res) => {
		const { _id } = req.params
		const { episodeName } = req.body
		const episodeSlug = toSlug(episodeName)
		try {
			await Films.updateOne(
				{ _id },
				{
					$push: {
						episodes: {
							episodeName,
							slugEpisode: episodeSlug,
						},
					},
				}
			)
			res.json({ msg: "Success add episode" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
}

module.exports = filmController
