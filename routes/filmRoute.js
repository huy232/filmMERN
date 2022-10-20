const router = require("express").Router()
const filmController = require("../controllers/filmController")
const auth = require("../middleware/auth")
const authTwoRole = require("../middleware/authTwoRole")

router.post("/create-film", filmController.createFilm)

router.get("/movies", filmController.getMovies)

router.get("/series", filmController.getSeries)

router.get("/specific-film/:_id", filmController.getFilm)

router.post("/add-episode/:_id", filmController.addEpisode)

module.exports = router
