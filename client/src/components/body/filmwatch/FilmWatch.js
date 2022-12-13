import React, { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { fetchUser, dispatchGetUser } from "../../../redux/actions/authAction"
import axios from "axios"
import "./filmwatch.css"

function FilmWatch() {
	const navigate = useNavigate()

	const { filmSlug } = useParams()
	const [watchData, setWatchData] = useState()
	const [currentEpisode, setCurrentEpisode] = useState("")
	const [currentTime, setCurrentTime] = useState()
	const [episodeName, setEpisodeName] = useState("")
	const [episodeId, setEpisodeId] = useState()

	const dispatch = useDispatch()
	const token = useSelector((state) => state.token)
	const auth = useSelector((state) => state.auth)

	const videoRef = useRef()

	useEffect(() => {
		if (filmSlug && auth.user.length !== 0) {
			const getFilm = async () => {
				const response = await axios.get(
					`/film/specific-film-by-slug/${filmSlug}`
				)

				const userPayment = await axios.post("/payment/user-payment", {
					stripeCustomerId: auth.user.stripeCustomerId,
				})

				const capitalString =
					response.data.film.type.charAt(0).toUpperCase() +
					response.data.film.type.slice(1)

				if (userPayment.data.length !== 0) {
					const test = userPayment.data.includes(capitalString)
					if (test) {
						// CHECK HISTORY

						if (auth.user["history"]) {
							const historyObject = auth.user.history.find(
								(film) => film.filmId === response.data.film._id
							)
							if (typeof historyObject !== "undefined") {
								if (response.data.film.episodes.length > 0) {
									const episodesArray = response.data.film.episodes
									const exactEpisode = episodesArray.find(
										(episode) => episode._id === historyObject.episodeId
									)
									if (exactEpisode) {
										setCurrentTime(historyObject.currentTime)
										setCurrentEpisode(exactEpisode.episodeUrl)
										setEpisodeName(exactEpisode.episodeName)
									}
								}
							}
						}

						setWatchData(response.data.film)
					} else {
						return navigate("/")
					}
				} else return navigate("/")
			}

			getFilm()
		}
	}, [filmSlug, auth.user, navigate])

	const handleEpisode = async (episodeUrl, filmId, episodeName, episodeId) => {
		await axios.patch("/user/user-watch-history", {
			_id: auth.user._id,
			filmId,
			currentTime: 0,
			episodeId,
		})

		setEpisodeId(episodeId)
		setCurrentEpisode(episodeUrl)
		setEpisodeName(episodeName)
		setCurrentTime(0)

		fetchUser(token).then((res) => {
			dispatch(dispatchGetUser(res))
		})
	}

	const handleSaveDuration = async (filmId) => {
		await axios.patch("/user/user-watch-history", {
			_id: auth.user._id,
			filmId,
			currentTime: videoRef.current.currentTime,
			episodeId,
		})

		fetchUser(token).then((res) => {
			dispatch(dispatchGetUser(res))
		})
	}
	return (
		<div className="film-watch-holder">
			{watchData && (
				<>
					<div className="currently-watch">
						<div className="current-watch-film-name">
							<h2>{watchData.filmName}</h2>
						</div>
						<div className="current-watch-episode-name">
							<h3>{`Currently watch: ${
								episodeName === "" ? "None" : episodeName
							}`}</h3>
						</div>
					</div>
					<div className="video-section">
						<video
							src={`${currentEpisode}`}
							controls
							ref={videoRef}
							onLoadedData={() => {
								videoRef.current.currentTime = currentTime
							}}
							onPause={() => handleSaveDuration(watchData._id)}
						/>
					</div>

					<div className="episode-holder">
						{watchData.episodes.map((episode, i) => (
							<div
								className={
									episodeId === i ? "watch-episode active" : "watch-episode"
								}
								key={i}
							>
								<button
									onClick={() =>
										handleEpisode(
											episode.episodeUrl,
											watchData._id,
											episode.episodeName,
											episode._id
										)
									}
								>
									Episode {i + 1}
								</button>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default FilmWatch
