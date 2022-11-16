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

		episodes: [
			{
				episodeName: { type: String },
				slugEpisode: { type: String },
				episodeUrl: { type: String },
			},
		],

		trailerName: { type: String },
		trailerUrl: { type: String },

		year: {
			type: Number,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Films", filmSchema)
