require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const path = require("path")

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(
	fileUpload({
		useTempFiles: true,
	})
)

// ROUTES
app.use("/user", require("./routes/userRoute"))
app.use("/api", require("./routes/upload"))
app.use("/payment", require("./routes/subs"))
app.use("/film", require("./routes/filmRoute"))

// Connect to mongoDB
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {}, (err) => {
	if (err) throw err
	console.log("Connect to Mongodb")
})

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"))
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client", "build", "index.html"))
	})
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`Server is running at ${PORT}`)
})
