import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchUser, dispatchGetUser } from "../../../redux/actions/authAction"
import { useSelector, useDispatch } from "react-redux"
import ReactLoading from "react-loading"

function Bookmark({ user }) {
	const [bookmark, setBookmark] = useState([])
	const [disable, setDisable] = useState(false)
	const [loading, setLoading] = useState(true)
	const token = useSelector((state) => state.token)
	const auth = useSelector((state) => state.auth)
	const dispatch = useDispatch()

	useEffect(() => {
		if (user.length !== 0) {
			const fetchBookmark = async () => {
				let arrayBookmark = []

				for (let i = 0; i < user.bookmark.length; i++) {
					let _id = user.bookmark[i].filmId
					const response = await axios.get(`/film/specific-film/${_id}`)
					if (response.data.film !== null) {
						arrayBookmark.push({ film: response.data.film })
					}
				}
				setBookmark(arrayBookmark)
				setLoading(false)
			}
			fetchBookmark()
		}
	}, [user])

	const handleRemoveBookmark = (userId, filmId) => {
		setDisable(true)
		axios.patch("/user/film-history-delete", {
			_id: userId,
			filmId,
		})
		fetchUser(token).then((res) => {
			dispatch(dispatchGetUser(res))
		})
		setDisable(false)
	}

	return (
		<div>
			{!loading ? (
				bookmark.length !== 0 && auth.user ? (
					<div className="film-bookmark">
						{bookmark.map((film) => (
							<div className="bookmark-holder" key={film?.film?._id}>
								<div className="bookmark-image">
									<img src={film?.film?.filmImage} alt="" />
								</div>
								<div className="bookmark-title" style={{ fontWeight: "700" }}>
									<h4
										style={{ fontSize: "1rem", margin: "8px 0" }}
										title={film?.film?.filmName}
									>
										{film?.film?.filmName}
									</h4>
								</div>
								<div className="film-type">
									{film?.film?.type.toUpperCase()}
								</div>
								<Link to={`/film-info/${film?.film?.filmSlug}`}>
									<button style={{ fontWeight: "bold" }}>PLAY</button>
								</Link>
								<button
									disable={disable.toString()}
									className="film-bookmark-delete-button"
									style={{ fontWeight: "bold", marginTop: "10px" }}
									onClick={() =>
										handleRemoveBookmark(auth.user._id, film?.film?._id)
									}
								>
									DELETE
								</button>
							</div>
						))}
					</div>
				) : (
					"There were no bookmark at all"
				)
			) : (
				<ReactLoading
					type={"spin"}
					color={"#ffffff"}
					height={"5%"}
					width={"5%"}
					className="react-loading-spinner"
				/>
			)}
		</div>
	)
}

export default Bookmark
