const router = require("express").Router()
const filmController = require("../controllers/filmController")
const auth = require("../middleware/auth")
const authTwoRole = require("../middleware/authTwoRole")

router.post("/create-film", filmController.createFilm)

module.exports = router
