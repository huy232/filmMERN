const Users = require("../models/userModel")

const authEmployee = async (req, res, next) => {
	try {
		const user = await Users.findOne({ _id: req.user.id })

		if (user.role !== 2) {
			return res.status(500).json({ msg: "Access to employee function denied" })
		}

		next()
	} catch (err) {
		return res.status(500).json({ msg: err.message })
	}
}

module.exports = authEmployee
