import React, { useState, useEffect } from "react"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { isLength, isMatch } from "../../utils/validation/Validation"
import {
	fetchAllUsers,
	dispatchGetAllUsers,
} from "../../../redux/actions/usersAction"
import AdminTable from "./AdminTable"
import Bookmark from "./Bookmark"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const initialState = {
	name: "",
	password: "",
	cf_password: "",
}

function Profile() {
	const auth = useSelector((state) => state.auth)
	const token = useSelector((state) => state.token)
	const users = useSelector((state) => state.users)

	const { user, isAdmin, isEmployee } = auth

	const [data, setData] = useState(initialState)
	const [avatar, setAvatar] = useState(false)
	const [loading, setLoading] = useState(false)
	const [toggle, setToggle] = useState("film")

	const { name, password, cf_password } = data
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
	}, [dispatch, isAdmin, token])

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

	const handleChange = (e) => {
		const { name, value } = e.target
		setData({ ...data, [name]: value })
	}

	const updateAvatar = async (e) => {
		e.preventDefault()
		try {
			const file = e.target.files[0]

			if (!file) {
				showToastMessage("No file were upload")
				return setData({ ...data })
			}
			if (file.size > 1024 * 1024) {
				showToastMessage("Size too large.")
				return setData({
					...data,
				})
			}
			if (file.type !== "image/jpeg" && file.type !== "image/png") {
				showToastMessage("File format is incorrect")
				return setData({
					...data,
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
			showSuccessToastMessage("Success update avatar")
			setLoading(false)
			setAvatar(res.data.url)
		} catch (err) {
			showToastMessage(err.response.data.msg)
			return setData({ ...data })
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

	const handleSection = (section) => {
		setToggle(section)
	}

	return (
		<>
			<ToastContainer />
			<div className="profile-page">
				<div className="col-left">
					<h2>
						{isAdmin && "Admin"}
						{!isAdmin && !isEmployee && "User"}
						{isEmployee && "Employee"}
					</h2>

					<div className="avatar">
						<img src={avatar ? avatar : user.avatar} alt="" />
						<div className="avatar-holder">
							<i className="fas fa-camera"></i>
							<input
								type="file"
								name="file"
								id="file_up"
								onChange={updateAvatar}
							/>
						</div>
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

					<div className="update-button">
						<button disabled={loading} onClick={handleUpdate}>
							Update
						</button>
					</div>
				</div>
				<div className="col-right">
					{isAdmin && (
						<button
							onClick={() => handleSection("admin")}
							className="user-button"
						>
							USER
						</button>
					)}

					<button
						onClick={() => handleSection("user")}
						className="bookmark-btn"
					>
						BOOKMARK
					</button>
					{toggle === "admin" ? (
						<AdminTable users={users} token={token} auth={auth} />
					) : (
						<Bookmark user={user} />
					)}
				</div>
			</div>
		</>
	)
}

export default Profile
