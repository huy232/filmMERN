import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"

function EditUser() {
	const { id } = useParams()
	const navigate = useNavigate()

	const users = useSelector((state) => state.users)
	const token = useSelector((state) => state.token)

	const [editUser, setEditUser] = useState()
	const [num, setNum] = useState()

	useEffect(() => {
		if (users.length !== 0) {
			users.payload.forEach((user) => {
				if (user._id === id) {
					setNum(user.role)
					setEditUser(user)
				}
			})
		} else {
			navigate("/profile")
		}
	}, [users, id, navigate])

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

			showSuccessToastMessage(res.data.msg)
		} catch (err) {
			err.response.data.msg && showToastMessage(err.response.data.msg)
		}
	}

	const handleOnChange = (e) => {
		setNum(Number(e.target.value))
	}

	return (
		<>
			{editUser && (
				<>
					<ToastContainer />
					<div className="edit-user">
						<div className="row">
							<button onClick={() => navigate("/profile")} className="go_back">
								<i className="fas fa-long-arrow-alt-left"></i> Go Back
							</button>
						</div>

						<div className="edit-wrapper">
							<div className="edit-form">
								<h2>Edit User</h2>

								<div className="form-group">
									<label htmlFor="name">Name</label>
									<input
										type="text"
										name="name"
										defaultValue={editUser.name}
										disabled
										className="name-disable"
									/>
								</div>

								<div className="form-group">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										name="email"
										defaultValue={editUser.email}
										disabled
										className="email-disable"
									/>
								</div>
								<div
									className="form-group radio"
									onChange={(e) => handleOnChange(e)}
								>
									<div
										className={num === 0 ? `user-select active` : `user-select`}
									>
										<input
											type="radio"
											id="isUser"
											name="role-check"
											value={0}
											defaultChecked={num === 0}
										/>
										<label htmlFor="isUser" className="option">
											<div className="dot"></div>
											<span>User</span>
										</label>
									</div>
									<div
										className={
											num === 1 ? `admin-select active` : `admin-select`
										}
									>
										<input
											type="radio"
											id="isAdmin"
											name="role-check"
											value={1}
											defaultChecked={num === 1}
										/>
										<label htmlFor="isAdmin" className="option">
											<div className="dot"></div>
											<span>Admin</span>
										</label>
									</div>
									<div
										className={
											num === 2 ? `employee-select active` : `employee-select`
										}
									>
										<input
											type="radio"
											id="isEmployee"
											name="role-check"
											value={2}
											defaultChecked={num === 2}
										/>
										<label htmlFor="isEmployee" className="option">
											<div className="dot"></div>
											<span>Employee</span>
										</label>
									</div>
								</div>

								<div className="update-edit-user">
									<button
										onClick={() => handleUpdate(num)}
										className="update-edit-user-btn"
									>
										Update
									</button>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	)
}

export default EditUser
