import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../../../supabaseClient"
import axios from "axios"
import Skeleton from "react-loading-skeleton"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./addfilm.css"

function FilmAddEpisode() {
	const { _id } = useParams()

	const videoRef = useRef()
	const [data, setData] = useState()
	const [episodeName, setEpisodeName] = useState("")
	const [selectVideo, setSelectVideo] = useState()
	const [preview, setPreview] = useState()
	const [onWait, setOnWait] = useState(false)

	const navigate = useNavigate()

	useEffect(() => {
		const getFilm = async () => {
			const response = await axios.get(`/film/specific-film/${_id}`)
			setData(response.data.film)
		}

		getFilm()
	}, [_id])

	useEffect(() => {
		if (selectVideo) {
			let objectUrlImage = URL.createObjectURL(selectVideo)
			setPreview(objectUrlImage)
		} else if (!selectVideo) setPreview(undefined)
	}, [_id, selectVideo])

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

	const handleEpisodeName = (e) => {
		const { value } = e.target
		setEpisodeName(value)
	}

	const onSelectVideo = (e) => {
		e.preventDefault()
		if (preview) {
			URL.revokeObjectURL(preview)
		}
		if (!e.target.files || e.target.files.length === 0) {
			setSelectVideo(undefined)
			return
		}
		const file = e.target.files[0]
		setSelectVideo(file)
	}

	const handleSubmit = async () => {
		try {
			setOnWait(true)
			let formData = new FormData()
			formData.append("file", selectVideo, episodeName)
			const { data } = await supabase.storage
				.from("film")
				.upload(`${episodeName}.mp4`, formData)

			const { data: secondData } = await supabase.storage
				.from("film")
				.getPublicUrl(`${data.path}`)
			const episodeData = {
				episodeName,
				episodeUrl: secondData.publicUrl,
			}

			await axios.post(`/film/add-episode/${_id}`, episodeData)
			// REVOKE AFTER DONE
			URL.revokeObjectURL(preview)
			setSelectVideo()
			showSuccessToastMessage("Success upload episode")
			setOnWait(false)
		} catch (err) {
			showToastMessage("Something went wrong")
		}
	}

	const handleGoBack = () => {
		navigate("/film-management")
	}

	return (
		<>
			<div className="go-back-button">
				<button onClick={() => handleGoBack()}>GO BACK</button>
			</div>
			<ToastContainer />
			{typeof data !== "undefined" && (
				<div className="add-episode-section">
					<div className="episode-name-holder">
						<div className="film-name-for-upload">
							<h2>{data.filmName}</h2>
							<h4>{data.type.toUpperCase()}</h4>
						</div>
						<label htmlFor="episode-name">Episode name: </label>
						<input
							type="text"
							name="episodeName"
							id="episodeName"
							placeholder="Enter film name"
							value={episodeName}
							onChange={handleEpisodeName}
						/>
					</div>
					<div className="episode-video-upload">
						<div className="preview-episode">
							{selectVideo ? (
								<video
									src={preview}
									alt=""
									width="40%"
									height="400px"
									ref={videoRef}
									onLoadedData={() => {
										videoRef.current.currentTime = videoRef.current.duration / 2
									}}
								/>
							) : (
								<Skeleton
									style={{
										width: "40%",
										height: "400px",
									}}
									baseColor="#202020"
									highlightColor="#444"
								/>
							)}
						</div>
						<input
							type="file"
							name="film-file"
							id="film-file"
							className="film-input-file"
							onChange={onSelectVideo}
						/>
						<label htmlFor="film-file" className="film-input-file-label">
							<i className="fas fa-photo-video"></i> Select Video..
						</label>
					</div>
					<div className="submit-episode">
						<button disabled={onWait} onClick={() => handleSubmit()}>
							Submit
						</button>
					</div>
				</div>
			)}
		</>
	)
}

export default FilmAddEpisode
