import React from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import {
	fetchAllUsers,
	dispatchGetAllUsers,
} from "../../../redux/actions/usersAction"
import { useDispatch } from "react-redux"

function AdminTable({ users, token, auth }) {
	const dispatch = useDispatch()

	const handleRemoveUser = async (id) => {
		await axios.delete(`/user/delete/${id}`, {
			headers: { Authorization: token },
		})

		return fetchAllUsers(token).then((res) => {
			dispatch(dispatchGetAllUsers(res))
		})
	}

	return (
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
											<i className="fas fa-user-tie" title={"Employee"}></i>
										) : (
											<i className="fas fa-user-friends" title={"User"}></i>
										)}
									</div>
								</td>
								<td className="table-user__action">
									<div className="action">
										<Link to={`/edit-user/${user._id}`}>
											<i className="fas fa-edit" title={"Edit"}></i>
										</Link>
										<i
											className="fas fa-user-slash"
											title={"Remove"}
											onClick={() => handleRemoveUser(user._id)}
										></i>
									</div>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	)
}

export default AdminTable
