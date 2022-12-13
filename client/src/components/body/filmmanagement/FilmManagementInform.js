import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { EditText, EditTextarea } from "react-edit-text"
import { useSelector } from "react-redux"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "react-edit-text/dist/index.css"
import "./filmmanagementinform.css"

var initialImage
var initialBanner

var initialArray

function FilmManagementInform() {
	const token = useSelector((state) => state.token)
	const { _id } = useParams()

	const [data, setData] = useState()
	let [arrayGenres, setArrayGenres] = useState([])
	// DEFAULT IMAGE
	let [imagePreview, setImagePreview] = useState(initialImage)
	let [bannerPreview, setBannerPreview] = useState(initialBanner)
	// WHEN SELECT
	let [selectedImage, setSelectedImage] = useState()
	let [selectedBanner, setSelectedBanner] = useState()
	// BLOB
	let [imageAfter, setImageAfter] = useState()
	let [bannerAfter, setBannerAfter] = useState()

	let [edit, setEdit] = useState()
	let [changeInput, setChangeInput] = useState("")

	const navigate = useNavigate()

	useEffect(() => {
		getSpecificFilm(_id)
	}, [_id])

	useEffect(() => {
		let objectUrlImage, objectUrlBanner

		if (selectedImage) {
			let objectUrlImage = URL.createObjectURL(selectedImage)
			setImageAfter(objectUrlImage)
		} else if (!selectedImage) setImageAfter(undefined)

		if (selectedBanner) {
			let objectUrlBanner = URL.createObjectURL(selectedBanner)
			setBannerAfter(objectUrlBanner)
		} else if (!selectedBanner) setBannerAfter(undefined)

		// free memory when ever this component is unmounted
		return () => {
			URL.revokeObjectURL(objectUrlImage)
			URL.revokeObjectURL(objectUrlBanner)
		}
	}, [selectedBanner, selectedImage])

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

	const getSpecificFilm = async (_id) => {
		const response = await axios.get(`/film/specific-film/${_id}`)
		initialImage = response.data.film.filmImage
		initialBanner = response.data.film.filmBanner
		initialArray = response.data.film.genres
		setArrayGenres(response.data.film.genres)
		setImagePreview(response.data.film.filmImage)
		setBannerPreview(response.data.film.filmBanner)
		setData(response.data.film)
	}

	const handleCheckbox = (e) => {
		let checkboxList = [...arrayGenres]

		if (e.target.checked) {
			checkboxList = [...arrayGenres, { genre: e.target.value }]
		} else {
			checkboxList = checkboxList.filter(
				(genre) => genre.genre !== e.target.value
			)
		}
		setArrayGenres(checkboxList)
	}

	const handleImage = (e) => {
		e.preventDefault()
		if (!e.target.files || e.target.files.length === 0) {
			setSelectedImage(undefined)
			return
		}
		const file = e.target.files[0]
		setSelectedImage(file)
	}

	const handleBanner = (e) => {
		e.preventDefault()
		if (!e.target.files || e.target.files.length === 0) {
			setSelectedBanner(undefined)
			return
		}
		const file = e.target.files[0]
		setSelectedBanner(file)
	}

	const handleFilmName = (e) => {
		setData({ ...data, filmName: e.target.value })
	}

	const handleFilmDescription = (e) => {
		setData({ ...data, filmDescription: e.target.value })
	}

	const handleEditEpisode = (id, episodeName) => {
		setChangeInput(episodeName)
		setEdit(id)
	}

	const handleUpdateEpisode = async (_id, episodeId, episodeName) => {
		await axios.patch(`/film/edit-episode/${_id}`, {
			episodeId,
			episodeName,
		})
		setEdit()
		getSpecificFilm(_id)
	}

	const handleCancel = () => {
		setChangeInput("")
		setEdit()
	}

	const handleChangeInput = (e) => {
		setChangeInput(e.target.value)
	}

	const handleDeleteEpisode = async (episodeId) => {
		await axios.patch(`/film/delete-episode/${_id}`, {
			episodeId,
		})
		getSpecificFilm(_id)
	}

	const handleSubmit = async () => {
		try {
			var imageResponse, bannerResponse

			if (selectedImage) {
				let formSelectedImage = new FormData()
				formSelectedImage.append("file", selectedImage)

				let imageResponseAxios = await axios.post(
					"/api/upload-film-image",
					formSelectedImage,
					{
						headers: {
							"content-type": "multipart/form-data",
							Authorization: token,
						},
					}
				)

				imageResponse = imageResponseAxios.data.url
			}

			if (selectedBanner) {
				let formSelectedBanner = new FormData()
				formSelectedBanner.append("file", selectedBanner)

				let bannerResponseAxios = await axios.post(
					"/api/upload-film-banner",
					formSelectedBanner,
					{
						headers: {
							"content-type": "multipart/form-data",
							Authorization: token,
						},
					}
				)

				bannerResponse = bannerResponseAxios.data.url
			}
			if (!imageResponse) {
				imageResponse = initialImage
			}
			if (!bannerResponse) {
				bannerResponse = initialBanner
			}

			let formBody = {
				filmName: data.filmName,
				filmDescription: data.filmDescription,
				genres: [...arrayGenres],
				filmImage: imageResponse,
				filmBanner: bannerResponse,
			}

			await axios.patch(`/film/update-film/${_id}`, formBody, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			})
			showSuccessToastMessage("Success update film info")
			getSpecificFilm(_id)
		} catch (err) {
			if (err.response.data.msg) {
				showToastMessage(err.response.data.msg)
			}
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
			<div className="film-management-information">
				{data && (
					<>
						<div className="film-name-wrapper">
							<h4 className="film-name-label">NAME</h4>
							<EditText
								name="film-name"
								defaultValue={data.filmName}
								inputClassName="bg-success"
								className="film-name-text-box"
								value={data.filmName}
								onChange={(e) => handleFilmName(e)}
							/>
						</div>

						<div className="film-description-wrapper">
							<h4 className="film-description-label">DESCRIPTION</h4>
							<EditTextarea
								name="film-description"
								defaultValue={data.filmDescription}
								inputClassName="bg-success"
								className="film-description-text-box"
								value={data.filmDescription}
								onChange={(e) => handleFilmDescription(e)}
							/>
						</div>

						<div className="three-wrapper">
							<div className="film-category-checkbox-wrapper">
								<h4 className="film-category-label">CATEGORY</h4>
								<div
									className="checkbox-category"
									onChange={(e) => handleCheckbox(e)}
								>
									<div>
										<input
											type="checkbox"
											id="action-genre"
											name="genre"
											value="Action"
											defaultChecked={initialArray.find((genre) => {
												if (genre.genre === "Action") {
													return true
												} else {
													return false
												}
											})}
										/>
										<label htmlFor="action-genre"> Action</label>
									</div>
									<div>
										<input
											type="checkbox"
											id="comedy-genre"
											name="genre"
											value="Comedy"
											defaultChecked={initialArray.find((genre) => {
												if (genre.genre === "Comedy") {
													return true
												} else {
													return false
												}
											})}
										/>
										<label htmlFor="comedy-genre"> Comedy</label>
									</div>

									<div>
										<input
											type="checkbox"
											id="mystery-genre"
											name="genre"
											value="Mystery"
											defaultChecked={initialArray.find((genre) => {
												if (genre.genre === "Mystery") {
													return true
												} else {
													return false
												}
											})}
										/>
										<label htmlFor="mystery-genre"> Mystery</label>
									</div>

									<div>
										<input
											type="checkbox"
											id="drama-genre"
											name="genre"
											value="Drama"
											defaultChecked={initialArray.find((genre) => {
												if (genre.genre === "Drama") {
													return true
												} else {
													return false
												}
											})}
										/>
										<label htmlFor="drama-genre"> Drama</label>
									</div>

									<div>
										<input
											type="checkbox"
											id="fantasy-genre"
											name="genre"
											value="Fantasy"
											defaultChecked={initialArray.find((genre) => {
												if (genre.genre === "Fantasy") {
													return true
												} else {
													return false
												}
											})}
										/>
										<label htmlFor="fantasy-genre"> Fantasy</label>
									</div>

									<div>
										<input
											type="checkbox"
											id="horror-genre"
											name="genre"
											value="Horror"
											defaultChecked={initialArray.find((genre) => {
												if (genre.genre === "Horror") {
													return true
												} else {
													return false
												}
											})}
										/>
										<label htmlFor="horror-genre"> Horror</label>
									</div>

									<div>
										<input
											type="checkbox"
											id="romance-genre"
											name="genre"
											value="Romance"
											defaultChecked={initialArray.find((genre) => {
												if (genre.genre === "Romance") {
													return true
												} else {
													return false
												}
											})}
										/>
										<label htmlFor="romance-genre"> Romance</label>
									</div>

									<div>
										<input
											type="checkbox"
											id="sci-fi-genre"
											name="sci-fi"
											value="Sci-fi"
											defaultChecked={initialArray.find((genre) => {
												if (genre.genre === "Sci-fi") {
													return true
												} else {
													return false
												}
											})}
										/>
										<label htmlFor="sci-fi-genre"> Sci-fi</label>
									</div>
								</div>
							</div>
							<div className="image-holder">
								<div className="image-wrapper">
									<h4 className="film-image-label">IMAGE</h4>
									<div className="film-image">
										<img src={imageAfter || imagePreview} alt="" />
										<input
											type="file"
											name="image-file"
											id="image-file-manage-inform"
											className="image-input-file"
											onChange={(e) => handleImage(e)}
										/>
										<label
											htmlFor="image-file-manage-inform"
											className="image-input-file-label"
										>
											<i className="fas fa-images"></i> Image...
										</label>
									</div>
								</div>
								<div className="banner-wrapper">
									<h4 className="film-banner-label">BANNER</h4>
									<div className="film-banner">
										<img src={bannerAfter || bannerPreview} alt="" />
										<input
											type="file"
											name="banner-file"
											id="banner-file-manage-inform"
											onChange={(e) => handleBanner(e)}
											className="banner-input-file"
										/>
										<label
											htmlFor="banner-file-manage-inform"
											className="banner-input-file-label"
										>
											<i className="fas fa-photo-video"></i> Banner...
										</label>
									</div>
								</div>
							</div>
						</div>

						<div className="update-film-button-management">
							<button onClick={() => handleSubmit()}>Update Film Info</button>
						</div>

						{data.episodes && (
							<div className="episode-holder">
								{data.episodes.map((episode) => (
									<div className="episode-wrapper" key={episode._id}>
										{edit === episode._id ? (
											<div className="episode-edit-wrapper">
												<form>
													<input
														type="text"
														onChange={(e) => handleChangeInput(e)}
														value={changeInput}
													/>
												</form>
												<button
													onClick={() =>
														handleUpdateEpisode(_id, episode._id, changeInput)
													}
												>
													Update
												</button>
												<button onClick={() => handleCancel()}>Cancel</button>
											</div>
										) : (
											<div className="episode-view-wrapper">
												<div className="episode">{episode.episodeName}</div>
												<button
													onClick={() =>
														handleEditEpisode(episode._id, episode.episodeName)
													}
												>
													Edit
												</button>
												<button
													onClick={() => handleDeleteEpisode(episode._id)}
												>
													Delete
												</button>
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</>
	)
}

export default FilmManagementInform
