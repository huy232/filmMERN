const router = require("express").Router()
const userController = require("../controllers/userController")
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")

router.post("/register", userController.register)
router.post("/activation", userController.activeEmail)
router.post("/login", userController.login)
router.post("/refresh-token", userController.getAccessToken)
router.post("/forgot", userController.forgotPassword)
router.post("/reset", auth, userController.resetPassword)
router.get("/user-information", auth, userController.getUserInformation)
router.get(
	"/all-user-information",
	auth,
	authAdmin,
	userController.getAllUserInformation
)
router.get("/logout", userController.logout)
router.patch("/update", auth, userController.updateUser)
router.patch("/update-role/:id", auth, authAdmin, userController.updateUserRole)
router.delete("/delete/:id", auth, authAdmin, userController.deleteUser)

// SOCIAL LOGIN

router.post("/google-login", userController.googleLogin)

module.exports = router
