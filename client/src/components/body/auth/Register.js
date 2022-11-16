import React, { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import {
	isEmpty,
	isEmail,
	isLength,
	isMatch,
} from "../../utils/validation/Validation"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const initialState = {
	name: "",
	email: "",
	password: "",
	cf_password: "",
}

function Register() {
	const [user, setUser] = useState(initialState)

	const { name, email, password, cf_password } = user

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
		setUser({ ...user, [name]: value, err: "", success: "" })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (isEmpty(name) || isEmpty(password)) {
			showToastMessage("Please fill in all the fields")
			return setUser({
				...user,
			})
		}
		if (!isEmail(email)) {
			showToastMessage("Invalid email")
			return setUser({ ...user })
		}
		if (isLength(password)) {
			showToastMessage("Password must be at least 6 characters")
			return setUser({
				...user,
			})
		}
		if (!isMatch(password, cf_password)) {
			showToastMessage("Password didn't match")
			return setUser({ ...user })
		}
		try {
			const res = await axios.post(`/user/register`, {
				name,
				email,
				password,
			})

			showSuccessToastMessage(res.data.msg)
			setUser({ ...user })
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
			<h2>Register</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="name">Name</label>
					<input
						type="text"
						placeholder="Enter your name"
						id="name"
						value={name}
						name="name"
						onChange={handleChangeInput}
					/>
				</div>
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
				<div>
					<label htmlFor="cf_password">Confirm password</label>
					<input
						type="password"
						placeholder="Confirm your password"
						id="cf_password"
						value={cf_password}
						name="cf_password"
						onChange={handleChangeInput}
					/>
				</div>

				<div className="row">
					<button type="submit">Register</button>
				</div>
			</form>
			<p>
				Already has an account? <Link to="/login">Login</Link>
			</p>
		</div>
	)
}

export default Register
