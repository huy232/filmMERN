import React from "react"
import { Routes, Route } from "react-router-dom"
import { useSelector } from "react-redux"
import ActivationEmail from "./auth/ActivationEmail"
import Login from "./auth/Login"
import Register from "./auth/Register"
import ForgotPassword from "./auth/ForgotPassword"
import ResetPassword from "./auth/ResetPassword"
import Profile from "./profile/Profile"
import NotFound from "../utils/notfound/NotFound"
import EditUser from "./profile/EditUser"
import Subscription from "./subscription/Subscription"
import FilmUpload from "./filmupload/FilmUpload"
import FilmManagement from "./filmmanagement/FilmManagement"
import FilmAddEpisode from "./filmmanagement/FilmAddEpisode"
import FilmManagementInform from "./filmmanagement/FilmManagementInform"
import Home from "./home/Home"
import FilmInfo from "./filminfo/FilmInfo"
import FilmAddTrailer from "./filmmanagement/FilmAddTrailer"
import FilmWatch from "./filmwatch/FilmWatch"

function Body() {
	const auth = useSelector((state) => state.auth)
	const { isLogged, isAdmin, isEmployee } = auth

	return (
		<section style={{ minHeight: "90vh" }}>
			<Routes>
				<Route
					path="/login"
					element={isLogged ? <NotFound /> : <Login />}
					exact
				/>
				<Route
					path="/register"
					element={isLogged ? <NotFound /> : <Register />}
					exact
				/>

				<Route
					path="/forgot-password"
					element={isLogged ? <NotFound /> : <ForgotPassword />}
					exact
				/>
				<Route
					path="/user/reset/:token"
					element={isLogged ? <NotFound /> : <ResetPassword />}
					exact
				/>

				<Route
					path="/user/activate/:activation_token"
					element={<ActivationEmail />}
					exact
				/>

				<Route
					path="/profile"
					element={isLogged ? <Profile /> : <NotFound />}
					exact
				/>
				<Route
					path="/edit-user/:id"
					element={isAdmin ? <EditUser /> : <NotFound />}
					exact
				/>

				<Route path="/plan" element={<Subscription />} exact />

				<Route
					path="/film-upload"
					element={isEmployee || isAdmin ? <FilmUpload /> : <NotFound />}
					exact
				/>

				<Route
					path="/film-management"
					element={isEmployee || isAdmin ? <FilmManagement /> : <NotFound />}
					exact
				/>
				<Route
					path="/add-episode/:_id"
					element={isEmployee || isAdmin ? <FilmAddEpisode /> : <NotFound />}
					exact
				/>
				<Route
					path="/add-trailer/:_id"
					element={isEmployee || isAdmin ? <FilmAddTrailer /> : <NotFound />}
					exact
				/>
				<Route
					path="/film-management/:_id"
					element={
						isEmployee || isAdmin ? <FilmManagementInform /> : <NotFound />
					}
					exact
				/>
				<Route path="/" element={<Home />} exact />
				<Route
					path="/film-info/:filmSlug"
					element={isLogged ? <FilmInfo /> : <NotFound />}
					exact
				/>

				<Route
					path="/film-watch/:filmSlug"
					element={isLogged ? <FilmWatch /> : <NotFound />}
					exact
				/>
			</Routes>
		</section>
	)
}

export default Body
