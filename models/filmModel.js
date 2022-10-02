const mongoose = require("mongoose")

const filmSchema = new mongoose.Schema(
	{
		filmName: {
			type: String,
			required: [true, "Require film name"],
			trim: true,
		},
		filmDescription: {
			type: String,
			default: 0,
		},
		type: {
			type: String,
			required: [true, "Specific movie or series"],
			trim: true,
		},
		genres: [{ type: String, required: [true, "Enter at least one genre"] }],
		filmBanner: {
			type: String,
			default: "dummyFilmImgBannerURL.jpg",
		},
		filmImage: {
			type: String,
			default: "dummyFilmImgURL.jpg",
		},
		episode: [{ episodeName: { type: String } }],
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Films", filmSchema)
