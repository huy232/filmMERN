import React, { useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { isLength, isMatch } from "../../utils/validation/Validation"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const initialState = {
	password: "",
	cf_password: "",
	err: "",
	success: "",
}

function ResetPassword() {
	const { token } = useParams()
	const [data, setData] = useState(initialState)

	const { password, cf_password } = data

	const handleChangeInput = (e) => {
		const { name, value } = e.target
		setData({ ...data, [name]: value, err: "", success: "" })
	}

	const handleResetPassword = async () => {
		if (isLength(password)) {
			showToastMessage("Password must be at least 6 characters")
			return setData({
				...data,
			})
		}
		if (!isMatch(password, cf_password)) {
			showToastMessage("Password did not match")
			return setData({ ...data })
		}

		try {
			const res = await axios.post(
				"/user/reset",
				{ password },
				{ headers: { Authorization: token } }
			)

			showSuccessToastMessage(res.data.msg)

			return setData({ ...data })
		} catch (err) {
			if (err.response.data.msg) {
				showToastMessage(err.response.data.msg)
				return { ...data }
			}
		}
	}

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

	return (
		<div className="fg-password">
			<ToastContainer />
			<h2>Reset your password</h2>

			<div className="row">
				<label htmlFor="password">Enter your new password</label>
				<input
					type="password"
					name="password"
					id="password"
					value={password}
					onChange={handleChangeInput}
				/>

				<label htmlFor="password">Confirm your new password</label>
				<input
					type="password"
					name="cf_password"
					id="cf_password"
					value={cf_password}
					onChange={handleChangeInput}
				/>

				<button onClick={handleResetPassword}>Reset your password</button>
			</div>
		</div>
	)
}

export default ResetPassword
