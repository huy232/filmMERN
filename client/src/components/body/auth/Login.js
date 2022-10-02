import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import {
	showErrMsg,
	showSuccessMsg,
} from "../../utils/notification/Notifications"
import { GoogleLogin, googleLogout } from "@react-oauth/google"
import { dispatchLogin } from "../../../redux/actions/authAction"
import jwt_decode from "jwt-decode"
import { useDispatch } from "react-redux"

const initialState = {
	email: "",
	password: "",
	err: "",
	success: "",
}

function Login() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [user, setUser] = useState(initialState)

	const { email, password, err, success } = user

	const handleChangeInput = (e) => {
		const { name, value } = e.target
		setUser({ ...user, [name]: value, err: "", success: "" })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const res = await axios.post(`/user/login`, { email, password })
			setUser({ ...user, err: "", success: res.data.msg })

			localStorage.setItem("firstLogin", true)

			dispatch(dispatchLogin())
			navigate("/")
		} catch (err) {
			err.response.data.msg &&
				setUser({ ...user, err: err.response.data.msg, success: "" })
		}
	}

	const responseGoogle = async (response) => {
		const decoded = jwt_decode(response.credential)
		const res = await axios.post("/user/google-login", {
			decoded,
		})
		setUser({ ...user, err: "", success: res.data.msg })

		localStorage.setItem("firstLogin", true)

		dispatch(dispatchLogin())
		navigate("/")
	}
	return (
		<div className="login_page">
			<h2>LOGIN</h2>
			{err && showErrMsg(err)}
			{success && showSuccessMsg(success)}
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email">Email</label>
					<input
						type="text"
						placeholder="Enter your email"
						id="email"
						value={email}
						name="email"
						onChange={handleChangeInput}
					/>
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						placeholder="Enter your password"
						id="password"
						value={password}
						name="password"
						onChange={handleChangeInput}
					/>
				</div>

				<div className="row">
					<button type="submit">Login</button>
					<Link to="/forgot-password">Forgot your password?</Link>
				</div>
			</form>

			<div className="hr" style={{ textAlign: "center" }}>
				Or login with
			</div>

			<div
				className="social"
				style={{ width: "100%", display: "flex", justifyContent: "center" }}
			>
				<GoogleLogin
					onSuccess={(credentialResponse) => {
						responseGoogle(credentialResponse)
					}}
					onError={() => {
						console.log("Login Failed")
					}}
				/>
			</div>

			<div className="new-user-register">
				<p>
					New to this site? <Link to="/register">Register</Link>
				</p>
			</div>
		</div>
	)
}

export default Login
