const Users = require("../models/userModel")
const Films = require("../models/filmModel")
const { CLIENT_URL } = process.env
const { toSlug } = require("../utils/index")
const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2022-08-01",
})

const ITEMS_PER_PAGE = 4

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
		const page = req.query.page || 1

		const query = { type: "movie" }

		try {
			const skip = (page - 1) * ITEMS_PER_PAGE
			const count = await Films.countDocuments(query)
			const films = await Films.find(query).limit(ITEMS_PER_PAGE).skip(skip)
			const pageCount = Math.ceil(count / ITEMS_PER_PAGE)
			res.json({
				films: films,
				pagination: {
					count,
					pageCount,
				},
			})
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	getSeries: async (req, res) => {
		const page = req.query.page || 1

		const query = { type: "series" }

		try {
			const skip = (page - 1) * ITEMS_PER_PAGE
			const count = await Films.countDocuments(query)
			const films = await Films.find(query).limit(ITEMS_PER_PAGE).skip(skip)
			const pageCount = Math.ceil(count / ITEMS_PER_PAGE)
			res.json({
				films: films,
				pagination: {
					count,
					pageCount,
				},
			})
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
}

module.exports = filmController
