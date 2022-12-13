import React, { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import "./filmupload.css"

const CATEGORY = [
	{ value: "Action", name: "action", checked: false },
	{ value: "Comedy", name: "comedy", checked: false },
	{ value: "Mystery", name: "mystery", checked: false },
	{ value: "Drama", name: "drama", checked: false },
	{ value: "Fantasy", name: "fantasy", checked: false },
	{ value: "Horror", name: "horror", checked: false },
	{ value: "Romance", name: "romance", checked: false },
	{ value: "Sci-fi", name: "sci-fi", checked: false },
]

const initialState = {
	filmName: "",
	filmDescription: "",
	type: "",
	genres: [],
	filmImage: "",
	filmBanner: "",
	episode: [],
}

function FilmUpload() {
	const token = useSelector((state) => state.token)

	const [data, setData] = useState(initialState)
	// IMAGE
	const [selectedImage, setSelectedImage] = useState()
	const [preview, setPreview] = useState()
	// BANNER
	const [selectedBanner, setSelectedBanner] = useState()
	const [previewBanner, setPreviewBanner] = useState()

	const { filmName, filmDescription, type, genres } = data

	useEffect(() => {
		var objectUrlImage, objectUrlBanner

		if (selectedImage) {
			objectUrlImage = URL.createObjectURL(selectedImage)
			setPreview(objectUrlImage)
		} else if (!selectedImage) setPreview()

		if (selectedBanner) {
			objectUrlBanner = URL.createObjectURL(selectedBanner)
			setPreviewBanner(objectUrlBanner)
		} else if (!selectedBanner) setPreviewBanner()

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

	const onSelectImage = (e) => {
		e.preventDefault()
		if (!e.target.files || e.target.files.length === 0) {
			setSelectedImage(undefined)
			return
		}
		const file = e.target.files[0]
		setSelectedImage(file)
	}

	const onSelectBanner = (e) => {
		e.preventDefault()
		if (!e.target.files || e.target.files.length === 0) {
			setSelectedBanner(undefined)
			return
		}
		const file = e.target.files[0]
		setSelectedBanner(file)
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setData({ ...data, [name]: value })
	}

	const handleRadio = (e) => {
		const { value } = e.target
		setData({ ...data, type: value })
	}

	const handleCheckbox = (e) => {
		let checkboxList = [...genres]

		if (e.target.checked) {
			checkboxList = [...genres, { genre: e.target.value }]
		} else {
			checkboxList.splice(genres.indexOf(e.target.value), 1)
		}
		setData({ ...data, genres: checkboxList })
	}

	const handleSubmit = async () => {
		try {
			if (!filmName) {
				showToastMessage("Please input film name!")
				return setData({ ...data })
			}

			if (!filmDescription) {
				showToastMessage("Please input film description!")
				return setData({ ...data })
			}
			if (!type) {
				showToastMessage("Please select film type!")
				return setData({ ...data })
			}
			if (genres.length === 0) {
				showToastMessage("Need at least 1 genre!")
				return setData({ ...data })
			}
			if (!selectedImage) {
				showToastMessage("No image were uploaded")
				return setData({ ...data })
			}
			if (selectedImage.size > 1024 * 1024 * 2) {
				showToastMessage("Size too large, limit < 2MB")
				return setData({ ...data })
			}
			if (
				selectedImage.type !== "image/jpeg" &&
				selectedImage.type !== "image/png"
			) {
				showToastMessage("Image format is incorrect")
				return setData({ ...data })
			}

			if (!selectedBanner) {
				showToastMessage("No file were uploaded")
				return setData({ ...data })
			}
			if (selectedBanner.size > 1024 * 1024 * 5) {
				showToastMessage("Size too large, limit < 5MB")
				return setData({ ...data })
			}
			if (
				selectedBanner.type !== "image/jpeg" &&
				selectedBanner.type !== "image/png"
			) {
				showToastMessage("Banner format is incorrect")
				return setData({ ...data })
			}

			let formSelectedImage = new FormData()
			formSelectedImage.append("file", selectedImage)

			const imageResponse = await axios.post(
				"/api/upload-film-image",
				formSelectedImage,
				{
					headers: {
						"content-type": "multipart/form-data",
						Authorization: token,
					},
				}
			)

			// --------------------------
			// -------------- BANNER --------------

			let formSelectedBanner = new FormData()
			formSelectedBanner.append("file", selectedBanner)

			const bannerResponse = await axios.post(
				"/api/upload-film-banner",
				formSelectedBanner,
				{
					headers: {
						"content-type": "multipart/form-data",
						Authorization: token,
					},
				}
			)

			const formBody = {
				filmName,
				filmDescription,
				type,
				genres,
				filmImage: imageResponse.data.url,
				filmBanner: bannerResponse.data.url,
			}

			await axios
				.post("/film/create-film", formBody, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				})
				.then((res) => {
					if (res.status === 200) {
						const clist = document.getElementsByTagName("input")
						for (const el of clist) {
							el.checked = false
						}

						setData({
							filmName: "",
							filmDescription: "",
							type: "",
							genres: [],
							filmImage: "",
							filmBanner: "",
							episode: [],
						})
						setSelectedImage()
						setSelectedBanner()
						URL.revokeObjectURL(preview)
						URL.revokeObjectURL(previewBanner)
						showSuccessToastMessage("Success upload film information")
					}
				})
		} catch (err) {
			showToastMessage(err.response.data.msg)
			setData({ ...data })
		}
	}

	return (
		<>
			<ToastContainer />
			<div className="film-upload">
				<div className="film-upload-wrapper">
					<div className="form-group__film-name">
						<label htmlFor="filmName">NAME</label>
						<input
							type="text"
							name="filmName"
							id="filmName"
							placeholder="Enter film name"
							value={filmName}
							onChange={handleChange}
						/>
					</div>
					<div className="form-group__film-description">
						<label htmlFor="filmDescription">DESCRIPTION</label>
						<textarea
							name="filmDescription"
							id="filmDescription"
							placeholder="Enter film description"
							value={filmDescription}
							onChange={handleChange}
						/>
					</div>
					<div className="form-group__type" onChange={handleRadio}>
						<label htmlFor="type">TYPE</label>
						<div
							className={
								data.type === "movie"
									? `radio-movie-type active`
									: "radio-movie-type"
							}
						>
							<input type="radio" id="movie-type" name="type" value="movie" />
							<label htmlFor="movie-type">Movie</label>
						</div>
						<div
							className={
								data.type === "series"
									? `radio-series-type active`
									: "radio-series-type"
							}
						>
							<input type="radio" id="series-type" name="type" value="series" />
							<label htmlFor="series-type">Series</label>
						</div>
					</div>

					<div className="form-group__category" onChange={handleCheckbox}>
						<label htmlFor="category">CATEGORY</label>
						{CATEGORY.map((genre) => (
							<div
								className={
									data.genres.find(
										(dataGenre) => dataGenre.genre === genre.value
									)
										? `film-genre active`
										: `film-genre`
								}
								key={genre.value}
							>
								<input
									type="checkbox"
									id={`${genre.name}-genre`}
									name={genre.name}
									value={genre.value}
								/>
								<label htmlFor={`${genre.name}-genre`}>{genre.value}</label>
							</div>
						))}
					</div>

					<div className="film-upload__image">
						<div className="film-upload-image__title">IMAGE</div>
						<div className="film-upload__holder-image">
							{selectedImage ? (
								<img src={preview} alt="" />
							) : (
								<Skeleton
									style={{
										width: "180px",
										height: "260px",
									}}
									baseColor="#202020"
									highlightColor="#444"
								/>
							)}

							<input
								type="file"
								name="image-file"
								id="image-file"
								onChange={onSelectImage}
								className="image-input-file"
							/>
							<label htmlFor="image-file" className="image-input-file-label">
								<i className="fas fa-images"></i> Image..
							</label>
						</div>
					</div>
					<div className="film-upload__banner">
						<div className="film-upload-banner__title">BANNER</div>
						<div className="film-upload__holder-banner">
							{selectedBanner ? (
								<img src={previewBanner} alt="" />
							) : (
								<Skeleton
									style={{
										width: "500px",
										height: "200px",
									}}
									baseColor="#202020"
									highlightColor="#444"
								/>
							)}
							<input
								type="file"
								name="banner-file"
								id="banner-file"
								onChange={onSelectBanner}
								className="banner-input-file"
							/>
							<label htmlFor="banner-file" className="banner-input-file-label">
								<i className="fas fa-photo-video"></i> Banner..
							</label>
						</div>
					</div>
					<button
						className="upload-submit-button"
						onClick={() => handleSubmit()}
					>
						SUBMIT
					</button>
				</div>
			</div>
		</>
	)
}

export default FilmUpload
