const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
	filmId: {
		type: String,
	},
	comment: [
		{
			userId: String,
			userName: String,
			userAvatar: String,
			userComment: String,
		},
	],
})

module.exports = mongoose.model("Comments", commentSchema)
