const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter your name!"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Please enter your email!"],
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Please enter your password!"],
		},
		role: {
			type: Number,
			default: 0,
		},
		avatar: {
			type: String,
			default:
				"https://res.cloudinary.com/dwg2oc5rv/image/upload/v1664652289/avatar/z5dtdjpylmfy70vjz7oi.png",
		},
		stripeCustomerId: {
			type: String,
			required: true,
		},
		history: [
			{
				filmId: String,
				currentTime: Number,
				episodeId: String,
				_id: false,
			},
		],
		bookmark: [{ filmId: String, _id: false }],
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Users", userSchema)
