import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../../../supabaseClient"
import axios from "axios"
import Skeleton from "react-loading-skeleton"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./addfilm.css"

function FilmAddTrailer() {
	const { _id } = useParams()

	const videoRef = useRef()
	const [data, setData] = useState()
	const [trailerName, setTrailerName] = useState("")
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

	const handleTrailerName = (e) => {
		const { value } = e.target
		setTrailerName(value)
	}

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
			formData.append("file", selectVideo, trailerName)

			const { data } = await supabase.storage
				.from("film")
				.upload(`${trailerName}.mp4`, formData)

			const { data: secondData } = supabase.storage
				.from("film")
				.getPublicUrl(`${data.path}`)

			const trailerData = {
				trailerName,
				trailerUrl: secondData.publicUrl,
			}

			await axios.patch(`/film/add-trailer/${_id}`, trailerData)
			showSuccessToastMessage("Success upload trailer")

			URL.revokeObjectURL(preview)
			setSelectVideo()
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
					<div className="film-name-for-upload">
						<h2>{data.filmName}</h2>
						<h4>{data.type.toUpperCase()}</h4>
					</div>
					<div className="episode-name-holder">
						<label htmlFor="episode-name">Trailer name: </label>
						<input
							type="text"
							name="episodeName"
							id="episodeName"
							placeholder="Enter film name"
							value={trailerName}
							onChange={handleTrailerName}
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
							name="trailer-file"
							id="trailer-file"
							className="trailer-input-file"
							onChange={onSelectVideo}
						/>
						<label htmlFor="trailer-file" className="trailer-input-file-label">
							<i className="fas fa-photo-video"></i> Select Trailer..
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

export default FilmAddTrailer
