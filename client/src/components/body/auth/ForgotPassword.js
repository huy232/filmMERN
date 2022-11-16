import React, { useState } from "react"
import axios from "axios"
import { isEmail } from "../../utils/validation/Validation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const initialState = {
	email: "",
	err: "",
	success: "",
}

function ForgotPassword() {
	const [data, setData] = useState(initialState)

	const { email } = data

	const handleChangeInput = (e) => {
		const { name, value } = e.target
		setData({ ...data, [name]: value, err: "", success: "" })
	}

	const handleForgotPassword = async () => {
		if (!isEmail(email)) {
			return setData({ ...data, err: "Invalids email", success: "" })
		}
		try {
			const res = await axios.post("/user/forgot", { email })
			showSuccessToastMessage(res.data.msg)
			return setData({ ...data })
		} catch (err) {
			if (err.response.data.msg) {
				showToastMessage(err.response.data.msg)
				return setData({ ...data })
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
			<h2>Forgot your password?</h2>
			<ToastContainer />
			<div className="row">
				<label htmlFor="email">Enter your email</label>
				<input
					type="email"
					name="email"
					id="email"
					value={email}
					onChange={handleChangeInput}
				/>
				<button onClick={handleForgotPassword}>Confirm</button>
			</div>
		</div>
	)
}

export default ForgotPassword
