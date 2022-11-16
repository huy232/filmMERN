import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { fetchUser, dispatchGetUser } from "../../../redux/actions/authAction"
import axios from "axios"
import "./filminfo.css"

function FilmInfo() {
	const { filmSlug } = useParams()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const token = useSelector((state) => state.token)
	const auth = useSelector((state) => state.auth)
	const [data, setData] = useState()
	const [disable, setDisable] = useState(false)
	const [commentSection, setCommentSection] = useState([])
	let [edit, setEdit] = useState()
	let [changeInput, setChangeInput] = useState("")
	let [postInput, setPostInput] = useState("")

	useEffect(() => {
		if (filmSlug && auth.user.stripeCustomerId) {
			const fetchFilm = async () => {
				const response = await axios.get(
					`/film/specific-film-by-slug/${filmSlug}`
				)

				const filmId = response.data.film._id
				const userPayment = await axios.post("/payment/user-payment", {
					stripeCustomerId: auth.user.stripeCustomerId,
				})

				const capitalString =
					response.data.film.type.charAt(0).toUpperCase() +
					response.data.film.type.slice(1)

				if (userPayment.data.length !== 0) {
					const test = userPayment.data.includes(capitalString)
					if (test) {
						const commentResponse = await axios.get(
							`/film/comment-section/${filmId}`
						)
						setCommentSection(commentResponse.data[0].comment)
						setData(response.data.film)
					} else {
						return navigate("/")
					}
				} else {
					return navigate("/")
				}
			}
			fetchFilm()
		}
	}, [auth.user, filmSlug, navigate])

	const handleBookmark = (userId, filmId) => {
		setDisable(true)
		axios.patch("/user/film-history", {
			_id: userId,
			filmId,
		})
		fetchUser(token).then((res) => {
			dispatch(dispatchGetUser(res))
		})
		setDisable(false)
	}

	const handleDeleteBookmark = (userId, filmId) => {
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

	const handleNavigate = (filmSlug) => {
		navigate(`/film-watch/${filmSlug}`)
	}

	const handleUpdateComment = (commentId, userComment) => {
		setChangeInput(userComment)
		setEdit(commentId)
	}

	const handleEditInput = (e) => {
		setChangeInput(e.target.value)
	}

	const handleChangeComment = async (
		commentId,
		userId,
		userComment,
		filmId
	) => {
		await axios.patch(`/film/comment/${filmId}`, {
			commentId,
			userId,
			userComment,
		})

		fetchUser(token).then((res) => {
			dispatch(dispatchGetUser(res))
		})

		setChangeInput("")
		setEdit()
	}

	const handlePostInput = (e) => {
		setPostInput(e.target.value)
	}

	const handleSubmitPostInput = async (
		userId,
		userComment,
		userName,
		userAvatar,
		filmId
	) => {
		await axios.patch(`/film/comment/${filmId}`, {
			userId,
			userComment,
			userName,
			userAvatar,
			filmId,
		})

		fetchUser(token).then((res) => {
			dispatch(dispatchGetUser(res))
		})

		setPostInput("")
	}

	const handleCancel = () => {
		setChangeInput("")
		setEdit()
	}

	const handleDelete = (filmId, commentId) => {
		axios.patch(`/film/delete-comment/${filmId}`, { commentId })
		fetchUser(token).then((res) => {
			dispatch(dispatchGetUser(res))
		})
	}

	return (
		<>
			{data && (
				<div className="film-info">
					<div className="banner-overlay">
						<div className="banner-image-info">
							<img src={`${data.filmBanner}`} alt="" />
						</div>
						<div className="banner-image-info-overlay"></div>
					</div>
					<div className="box-info">
						<div className="box-info-wrapper">
							<div className="cover-wrapper">
								<div className="box-info__film-image">
									<img src={data.filmImage} alt="" />
								</div>
								<div className="box-info__film-left-detail">
									<div className="title">
										<h4>TITLE</h4>
										<h6>{data.filmName}</h6>
									</div>
									<div className="format">
										<h4>TYPE</h4>
										<h6>{data.type.toUpperCase()}</h6>
									</div>
									<div className="detail-category-card">
										<h4>CATEGORY</h4>
										{data.genres.map((genre) => (
											<div className="category-genre" key={genre.genre}>
												<h5>{genre.genre}</h5>
											</div>
										))}
									</div>
								</div>
							</div>
							<div className="detail-wrapper">
								<div className="play-now-button">
									{data.episodes.length !== 0 ? (
										<button onClick={() => handleNavigate(data.filmSlug)}>
											PLAY NOW <i className="fas fa-arrow-right"></i>
										</button>
									) : (
										<button disable={"true"} className="not-available-button">
											NOT AVAILABLE
										</button>
									)}
								</div>
								<div className="bookmark-button">
									{auth.user?.bookmark.find((id) => id.filmId === data._id) ? (
										<button
											className="bookmarked-button"
											onClick={() =>
												handleDeleteBookmark(auth.user._id, data._id)
											}
										>
											BOOKMARKED <i className="far fa-check-square"></i>
										</button>
									) : (
										<button
											onClick={() => handleBookmark(auth.user._id, data._id)}
											disable={disable.toString()}
										>
											BOOKMARK <i className="fas fa-bookmark"></i>
										</button>
									)}
								</div>
								<div className="detail-description">
									<p>{data.filmDescription}</p>
								</div>
								<div className="trailer-box">
									<h3>IN CASE YOU INTERESTED?</h3>
									<div className="trailer-video">
										<video src={data.trailerUrl} controls />
									</div>
								</div>

								<div className="comment-section">
									<h3 style={{ color: "white", textAlign: "center" }}>
										COMMENT & REVIEW SECTION
									</h3>
									<div className="comment-section-holder">
										{commentSection.length > 0
											? commentSection.map((commentCard) => (
													<div className="comment-card" key={commentCard._id}>
														<div className="comment-head">
															<div className="comment-avatar">
																<img src={commentCard.userAvatar} alt="" />
															</div>
															<div className="comment-user-name">
																<p>{commentCard.userName}</p>
															</div>
														</div>

														{auth.user._id === commentCard.userId ? (
															edit === commentCard._id ? (
																<>
																	<form className="comment-content">
																		<textarea
																			type="text"
																			onChange={(e) => handleEditInput(e)}
																			value={changeInput}
																			className="comment-input"
																			style={{ width: "100%" }}
																		/>
																	</form>
																	<div className="comment-bottom">
																		<button
																			onClick={() =>
																				handleChangeComment(
																					commentCard._id,
																					commentCard.userId,
																					changeInput,
																					data._id
																				)
																			}
																		>
																			Update
																		</button>
																		<button onClick={() => handleCancel()}>
																			Cancel
																		</button>
																	</div>
																</>
															) : (
																<>
																	<div className="comment-content">
																		<p>{commentCard.userComment}</p>
																	</div>
																	<div className="comment-bottom">
																		<button
																			onClick={() =>
																				handleUpdateComment(
																					commentCard._id,
																					commentCard.userComment
																				)
																			}
																		>
																			Edit
																		</button>
																		<button
																			onClick={() =>
																				handleDelete(data._id, commentCard._id)
																			}
																		>
																			Delete
																		</button>
																	</div>
																</>
															)
														) : (
															<>
																<div className="comment-content">
																	<p>{commentCard.userComment}</p>
																</div>
															</>
														)}
													</div>
											  ))
											: ""}
									</div>

									<div className="comment-post">
										<form className="comment-post-form">
											<textarea
												type="text"
												onChange={(e) => handlePostInput(e)}
												value={postInput}
												className="comment-post-input"
												style={{ width: "100%" }}
											/>
										</form>
										<div className="submit-comment-post">
											<button
												onClick={() =>
													handleSubmitPostInput(
														auth.user._id,
														postInput,
														auth.user.name,
														auth.user.avatar,
														data._id
													)
												}
											>
												Post
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default FilmInfo
