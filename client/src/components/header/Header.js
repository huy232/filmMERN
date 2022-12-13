import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import axios from "axios"

function Header() {
	const auth = useSelector((state) => state.auth)

	const { user, isLogged, isAdmin, isEmployee } = auth

	const handleLogout = async () => {
		try {
			await axios.get("/user/logout")
			localStorage.removeItem("firstLogin")
			window.location.href = "/"
		} catch (err) {
			window.location.href = "/"
		}
	}

	const userLink = () => {
		return (
			<li className="drop-nav">
				<Link to="/profile" className="avatar">
					<img src={user.avatar} alt="" />
				</Link>
				<Link to="/" onClick={() => handleLogout()}>
					<i className="fas fa-sign-out-alt"></i>
				</Link>
			</li>
		)
	}

	return (
		<header>
			<div className="logo">
				<h1>
					<Link to="/">Film Project</Link>
				</h1>
			</div>
			<ul>
				{isAdmin || isEmployee ? (
					<>
						<li>
							<Link to="/film-management">
								<i className="fas fa-tasks" />
								<p className="management-paragraph">Management</p>
							</Link>
						</li>
						<li>
							<Link to="/film-upload">
								<i className="fas fa-film" />
								<p className="management-paragraph">Upload</p>
							</Link>
						</li>
					</>
				) : (
					""
				)}
				{isLogged ? (
					userLink()
				) : (
					<li>
						<Link to="/login">
							<i className="fas fa-sign-in-alt" /> Login
						</Link>
					</li>
				)}
			</ul>
		</header>
	)
}

export default Header
