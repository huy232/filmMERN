const router = require("express").Router()
const subsController = require("../controllers/subsController")
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")

router.get("/prices", subsController.stripePrices)

router.post("/session", subsController.stripeSession)

module.exports = router
