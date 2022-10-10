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
		},
		type: {
			type: String,
			required: [true, "Specific movie or series"],
			trim: true,
		},
		genres: [
			{
				genre: {
					type: String,
					required: [true, "Enter at least one genre"],
				},
				_id: false,
			},
		],
		filmBanner: {
			type: String,
		},
		filmImage: {
			type: String,
		},
		filmSlug: {
			type: String,
			require: [true, "Please provide the film with slug"],
		},
		episode: [{ episodeName: { type: String }, _id: false }],
		filmComment: [
			{ userId: { type: String }, userComment: { type: String }, _id: false },
		],
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Films", filmSchema)
