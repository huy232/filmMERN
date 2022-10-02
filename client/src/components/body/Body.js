import React from "react"
import { Routes, Route } from "react-router-dom"
import ActivationEmail from "./auth/ActivationEmail"
import Login from "./auth/Login"
import Register from "./auth/Register"
import ForgotPassword from "./auth/ForgotPassword"
import ResetPassword from "./auth/ResetPassword"
import Profile from "./profile/Profile"
import NotFound from "../utils/notfound/NotFound"
import EditUser from "./profile/EditUser"

import { useSelector } from "react-redux"
function Body() {
	const auth = useSelector((state) => state.auth)
	const { isLogged, isAdmin } = auth

	return (
		<section>
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
			</Routes>
		</section>
	)
}

export default Body
