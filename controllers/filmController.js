const Users = require("../models/userModel")
const Films = require("../models/filmModel")
const { CLIENT_URL } = process.env
const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2022-08-01",
})

const filmController = {
	createFilm: async (req, res) => {
		const {
			filmName,
			filmSlug,
			filmDescription,
			type,
			genres,
			filmBanner,
			filmImage,
			episode,
		} = req.body

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

		return res.json({ msg: "Successful create a film" })
	},
}

module.exports = filmController
