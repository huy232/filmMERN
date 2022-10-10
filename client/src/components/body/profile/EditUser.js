import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import axios from "axios"
import {
	showSuccessMsg,
	showErrMsg,
} from "../../utils/notification/Notifications"

function EditUser() {
	const { id } = useParams()
	const navigate = useNavigate()

	const users = useSelector((state) => state.users)
	const token = useSelector((state) => state.token)

	const [editUser, setEditUser] = useState([])
	const [err, setErr] = useState(false)
	const [success, setSuccess] = useState(false)
	const [num, setNum] = useState(0)

	useEffect(() => {
		if (users.length !== 0) {
			users.payload.forEach((user) => {
				if (user._id === id) {
					setEditUser(user)
				}
			})
		} else {
			navigate("/profile")
		}
	}, [users, id, navigate])

	const handleUpdate = async (number) => {
		try {
			const res = await axios.patch(
				`/user/update-role/${editUser._id}`,
				{
					role: number,
				},
				{
					headers: { Authorization: token },
				}
			)

			setSuccess(res.data.msg)
		} catch (err) {
			err.response.data.msg && setErr(err.response.data.msg)
		}
	}

	const handleOnChange = (e) => {
		setNum(e.target.value)
	}

	return (
		<>
			<div className="profile-page edit-user">
				<div className="row">
					<button onClick={() => navigate(-1)} className="go_back">
						<i className="fas fa-long-arrow-alt-left"></i> Go Back
					</button>
				</div>

				<div className="col-left">
					<h2>Edit User</h2>

					<div className="form-group">
						<label htmlFor="name">Name</label>
						<input
							type="text"
							name="name"
							defaultValue={editUser.name}
							disabled
						/>
					</div>

					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							name="email"
							defaultValue={editUser.email}
							disabled
						/>
					</div>

					<div className="form-group" onChange={(e) => handleOnChange(e)}>
						<input type="radio" id="isAdmin" name="role-check" value={0} />
						<label htmlFor="isUser">User</label>
						<input type="radio" id="isAdmin" name="role-check" value={1} />
						<label htmlFor="isAdmin">Admin</label>
						<input type="radio" id="isEmployee" name="role-check" value={2} />
						<label htmlFor="isEmployee">Employee</label>
					</div>

					<button onClick={() => handleUpdate(num)}>Update</button>

					{err && showErrMsg(err)}
					{success && showSuccessMsg(success)}
				</div>
			</div>
		</>
	)
}

export default EditUser
