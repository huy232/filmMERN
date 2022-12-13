const Users = require("../models/userModel")
const Films = require("../models/filmModel")
const Comment = require("../models/commentModel")
const { CLIENT_URL } = process.env
const { toSlug } = require("../utils/index")
const Stripe = require("stripe")
const axios = require("axios")
const FormData = require("form-data")
const fs = require("fs")

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

		newFilm.save().then((res) => {
			const newComment = new Comment({
				filmId: res._id,
				comment: [],
			})
			newComment.save()
		})

		return res.json({ msg: "Successful create a film" })
	},
	getMovies: async (req, res) => {
		let { filmName, genre } = req.query || ""
		const page = req.query.page || 1
		const query = {
			type: "movie",
			filmName: { $regex: `${filmName}`, $options: "i" },
			"genres.genre": { $regex: `${genre}`, $options: "i" },
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
		let { filmName, genre } = req.query || ""
		const page = req.query.page || 1
		const query = {
			type: "series",
			filmName: { $regex: `${filmName}`, $options: "i" },
			"genres.genre": { $regex: `${genre}`, $options: "i" },
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
	getFilmBySlug: async (req, res) => {
		const { filmSlug } = req.params
		try {
			if (!filmSlug) {
				return res.json({ msg: "No film were found" })
			}

			const specificFilm = await Films.find({ filmSlug })
			return res.json({
				film: specificFilm[0],
			})
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	addEpisode: async (req, res) => {
		const { _id } = req.params
		const { episodeName, episodeUrl } = req.body
		try {
			if (!episodeName && !episodeUrl) {
				return res.json({ msg: "Missing require fields" })
			}

			const episodeSlug = toSlug(episodeName)

			await Films.updateOne(
				{ _id },
				{
					$push: {
						episodes: {
							episodeName,
							slugEpisode: episodeSlug,
							episodeUrl,
						},
					},
				}
			)

			res.json({ msg: "Success add episode" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	addTrailer: async (req, res) => {
		const { _id } = req.params
		const { trailerName, trailerUrl } = req.body
		try {
			if (!trailerName && !trailerUrl) {
				return res.json({ msg: "Missing require fields" })
			}
			await Films.updateOne(
				{ _id },
				{
					trailerName,
					trailerUrl,
				}
			)
			res.json({ msg: "Success add trailer" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	updateFilm: async (req, res) => {
		const { _id } = req.params
		let { filmName, filmDescription, genres, filmBanner, filmImage, filmSlug } =
			req.body

		try {
			if (filmName) {
				filmSlug = toSlug(filmName)
			}

			await Films.findOneAndUpdate(
				{ _id },
				{
					filmName,
					filmDescription,
					genres,
					filmBanner,
					filmImage,
					filmSlug,
				}
			)

			res.json({ msg: "Success update" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	editEpisode: async (req, res) => {
		const { _id } = req.params
		const { episodeId, episodeName } = req.body

		try {
			await Films.updateOne(
				{ _id, "episodes._id": episodeId },
				{
					$set: {
						"episodes.$.episodeName": episodeName,
					},
				}
			)

			res.json({ msg: "Success update episode name" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	deleteEpisode: async (req, res) => {
		const { _id } = req.params
		const { episodeId } = req.body

		try {
			await Films.updateOne(
				{
					_id,
				},
				{
					$pull: { episodes: { _id: episodeId } },
				},
				{ new: true }
			)
			res.json({ msg: "Success delete episode" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	updateComment: async (req, res) => {
		const { _id } = req.params

		const { commentId, userId, userComment, userAvatar, userName } = req.body
		try {
			const response = await Comment.updateOne(
				{ filmId: _id, "comment.userId": userId, "comment._id": commentId },
				{
					$set: {
						"comment.$.userComment": userComment,
					},
				}
			)

			if (response.matchedCount === 0) {
				await Comment.updateOne(
					{ filmId: _id },
					{
						$push: {
							comment: {
								userId,
								userComment,
								userAvatar,
								userName,
							},
						},
					}
				)
			}
			res.json({ msg: "Update comment" })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	createCommentSection: async (req, res) => {
		const { _id } = req.params

		try {
			res.json("Save comment section to film")
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	getCommentSection: async (req, res) => {
		const { filmId } = req.params

		try {
			const response = await Comment.find({ filmId })
			res.json(response)
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	deleteComment: async (req, res) => {
		const { filmId } = req.params
		const { commentId } = req.body

		try {
			await Comment.updateOne(
				{ filmId },
				{
					$pull: {
						comment: { _id: commentId },
					},
				},
				{ new: true }
			)
			res.json("Success delete comment")
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	deleteFilm: async (req, res) => {
		const { filmId } = req.params

		try {
			await Films.findByIdAndDelete(filmId)
			await Comment.deleteOne({ filmId })
			res.json("Success delete films")
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
}

module.exports = filmController
