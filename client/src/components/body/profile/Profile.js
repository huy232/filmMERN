import React, { useState, useEffect } from "react"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { isLength, isMatch } from "../../utils/validation/Validation"
import {
	showErrMsg,
	showSuccessMsg,
} from "../../utils/notification/Notifications"
import {
	fetchAllUsers,
	dispatchGetAllUsers,
} from "../../../redux/actions/usersAction"

const initialState = {
	name: "",
	password: "",
	cf_password: "",
	err: "",
	success: "",
}

function Profile() {
	const auth = useSelector((state) => state.auth)
	const token = useSelector((state) => state.token)
	const users = useSelector((state) => state.users)

	const { user, isAdmin } = auth

	const [data, setData] = useState(initialState)
	const [avatar, setAvatar] = useState(false)
	const [loading, setLoading] = useState(false)
	const [callback, setCallback] = useState(false)

	const { name, password, cf_password, err, success } = data
	const dispatch = useDispatch()
	useEffect(() => {
		const fetchUsers = async () => {
			return fetchAllUsers(token).then((res) => {
				dispatch(dispatchGetAllUsers(res))
			})
		}
		if (isAdmin) {
			fetchUsers()
		}
		fetchUsers()
	}, [dispatch, isAdmin, token, callback])

	const handleChange = (e) => {
		const { name, value } = e.target
		setData({ ...data, [name]: value, err: "", success: "" })
	}

	const updateAvatar = async (e) => {
		e.preventDefault()
		try {
			const file = e.target.files[0]

			if (!file)
				return setData({ ...data, err: "No file were uploaded", success: "" })
			if (file.size > 1024 * 1024)
				return setData({
					...data,
					err: "Size too large, limit < 1MB",
					success: "",
				})
			if (file.type !== "image/jpeg" && file.type !== "image/png") {
				return setData({
					...data,
					err: "File format is incorrect",
					success: "",
				})
			}

			let formData = new FormData()
			formData.append("file", file)

			setLoading(true)

			const res = await axios.post("/api/upload-avatar", formData, {
				headers: {
					"content-type": "multipart/form-data",
					Authorization: token,
				},
			})
			setLoading(false)
			setAvatar(res.data.url)
		} catch (err) {
			setData({ ...data, err: err.response.data.msg, success: "" })
		}
	}

	const updateInformation = () => {
		try {
			axios.patch(
				"/user/update",
				{
					name: name ? name : user.name,
					avatar: avatar ? avatar : user.avatar,
				},
				{ headers: { Authorization: token } }
			)
			setData({ ...data, err: "", success: "Update success" })
		} catch (err) {
			setData({ ...data, err: err.response.data.msg, success: "" })
		}
	}

	const updatePassword = () => {
		if (isLength(password))
			return setData({
				...data,
				err: "Password must be at least 6 characters",
				success: "",
			})
		if (!isMatch(password, cf_password)) {
			return setData({ ...data, err: "Password did not match", success: "" })
		}
		try {
			axios.post(
				"/user/reset",
				{
					password,
				},
				{ headers: { Authorization: token } }
			)
			setData({ ...data, err: "", success: "Update success" })
		} catch (err) {
			setData({ ...data, err: err.response.data.msg, success: "" })
		}
	}

	const handleUpdate = () => {
		if (name || avatar) updateInformation()
		if (password) updatePassword()
	}

	return (
		<>
			{err && showErrMsg(err)}
			{success && showSuccessMsg(success)}
			{loading && <h3>Loading...</h3>}
			<div className="profile-page">
				<div className="col-left">
					<h2>{isAdmin ? "Admin profile" : "User profile"}</h2>

					<div className="avatar">
						<img src={avatar ? avatar : user.avatar} alt="" />
						<span>
							<i className="fas fa-camera"></i>
							<p>Change</p>
							<input
								type="file"
								name="file"
								id="file_up"
								onChange={updateAvatar}
							/>
						</span>
					</div>

					<div className="form-group">
						<label htmlFor="name">Name</label>
						<input
							type="text"
							name="name"
							id="name"
							placeholder={user.name}
							value={name}
							onChange={handleChange}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							type="text"
							name="email"
							id="email"
							placeholder="Your email"
							defaultValue={user.email}
							disabled
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="Your password"
							value={password}
							onChange={handleChange}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="cf_password">Confirm password</label>
						<input
							type="password"
							name="cf_password"
							id="cf_password"
							placeholder="Your confirm password"
							value={cf_password}
							onChange={handleChange}
						/>
					</div>

					<div>
						<em style={{ color: "crimson" }}>
							*If you change and update your password here, you will not be able
							to use login through Google anymore
						</em>
					</div>

					<button disabled={loading} onClick={handleUpdate}>
						Update
					</button>
				</div>
				<div className="col-right">
					<h2>{isAdmin ? "Users" : "Orders"}</h2>

					<div style={{ overflowX: "auto" }}>
						<table className="customers">
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Email</th>
									<th>Role</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{users.length !== 0 &&
									users.payload.map((user) => (
										<tr key={user._id}>
											<td className="table-user__id">{user._id}</td>
											<td className="table-user__name">{user.name}</td>
											<td className="table-user__email">{user.email}</td>
											<td className="table-user__role">
												<div className="user-type">
													{user.role === 1 ? (
														<i className="fas fa-crown" title={"Admin"}></i>
													) : user.role === 2 ? (
														<i
															className="fas fa-user-tie"
															title={"Employee"}
														></i>
													) : (
														<i
															className="fas fa-user-friends"
															title={"User"}
														></i>
													)}
												</div>
											</td>
											<td className="table-user__action">
												<Link to={`/edit-user/${user._id}`}>
													<i className="fas fa-edit" title={"Edit"}></i>
												</Link>
												<i className="fas fa-user-slash" title={"Remove"}></i>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	)
}

export default Profile
