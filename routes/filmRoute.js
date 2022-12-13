const router = require("express").Router()
const filmController = require("../controllers/filmController")
const auth = require("../middleware/auth")
const authTwoRole = require("../middleware/authTwoRole")

router.post("/create-film", filmController.createFilm)

router.get("/movies", filmController.getMovies)

router.get("/series", filmController.getSeries)

router.get("/specific-film/:_id", filmController.getFilm)

router.get("/specific-film-by-slug/:filmSlug", filmController.getFilmBySlug)

router.post("/add-episode/:_id", filmController.addEpisode)

router.patch("/add-trailer/:_id", filmController.addTrailer)

router.patch("/update-film/:_id", filmController.updateFilm)

router.patch("/edit-episode/:_id", filmController.editEpisode)

router.patch("/delete-episode/:_id", filmController.deleteEpisode)

router.patch("/comment/:_id", filmController.updateComment)

router.get("/comment-section/:filmId", filmController.getCommentSection)

router.patch("/delete-comment/:filmId", filmController.deleteComment)

router.delete("/delete-film/:filmId", filmController.deleteFilm)

module.exports = router
