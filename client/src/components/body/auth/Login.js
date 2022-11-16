import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { GoogleLogin } from "@react-oauth/google"
import { dispatchLogin } from "../../../redux/actions/authAction"
import jwt_decode from "jwt-decode"
import { useDispatch } from "react-redux"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const initialState = {
	email: "",
	password: "",
}

function Login() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [user, setUser] = useState(initialState)

	const { email, password } = user

	const showToastMessage = (msg) => {
		toast.error(msg, {
			position: toast.POSITION.TOP_RIGHT,
		})
	}

	const showSuccessToastMessage = (msg) => {
		toast.success(msg, {
			position: toast.POSITION.TOP_RIGHT,
		})
	}

	const handleChangeInput = (e) => {
		const { name, value } = e.target
		setUser({ ...user, [name]: value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const res = await axios.post(`/user/login`, { email, password })

			showSuccessToastMessage(res.data.msg)
			setUser({ ...user })
			localStorage.setItem("firstLogin", true)

			dispatch(dispatchLogin())
			navigate("/")
		} catch (err) {
			if (err.response.data.msg) {
				showToastMessage(err.response.data.msg)
				return setUser({ ...user })
			}
		}
	}

	const responseGoogle = async (response) => {
		try {
			const decoded = jwt_decode(response.credential)
			const res = await axios.post("/user/google-login", {
				decoded,
			})
			showSuccessToastMessage(res.data.msg)
			setUser({ ...user })

			localStorage.setItem("firstLogin", true)

			dispatch(dispatchLogin())
			navigate("/")
		} catch (err) {
			if (err.response.data.msg) {
				showToastMessage(err.response.data.msg)
				return setUser({ ...user })
			}
		}
	}
	return (
		<div className="login_page">
			<ToastContainer />
			<h2>LOGIN</h2>
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
