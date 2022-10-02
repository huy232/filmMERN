import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import axios from "axios"

function Header() {
	const auth = useSelector((state) => state.auth)

	const { user, isLogged } = auth

	const handleLogout = async () => {
		try {
			await axios.get("/user/logout")
			localStorage.removeItem("firstLogin")
			window.location.href = "/"
		} catch (err) {
			console.log("Error then run here")
			window.location.href = "/"
		}
	}

	const userLink = () => {
		return (
			<li className="drop-nav">
				<Link to="#" className="avatar">
					<img src={user.avatar} alt="" /> {user.name}{" "}
					<i className="far fa-caret-square-down"></i>
				</Link>
				<ul className="dropdown">
					<li>
						<Link to="/profile">Profile</Link>
					</li>
					<li>
						<Link to="/" onClick={() => handleLogout()}>
							Logout
						</Link>
					</li>
				</ul>
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
				<li>
					<Link to="/film">
						<i className="fas fa-film" /> Film
					</Link>
				</li>
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
