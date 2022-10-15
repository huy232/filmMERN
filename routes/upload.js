const router = require("express").Router()
const uploadImage = require("../middleware/uploadImage")
const uploadFilmBanner = require("../middleware/uploadFilmBanner")
const uploadFilmImage = require("../middleware/uploadFilmImage")
const uploadController = require("../controllers/uploadController")
const authTwoRole = require("../middleware/authTwoRole")
const auth = require("../middleware/auth")

router.post("/upload-avatar", uploadImage, auth, uploadController.uploadAvatar)
router.post(
	"/upload-film-image",
	uploadFilmImage,
	uploadController.uploadFilmImage
)
router.post(
	"/upload-film-banner",
	uploadFilmBanner,
	uploadController.uploadFilmBanner
)

module.exports = router
