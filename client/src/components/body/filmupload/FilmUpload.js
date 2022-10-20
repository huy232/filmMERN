import React, { useEffect, useState } from "react"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import {
	showErrMsg,
	showSuccessMsg,
} from "../../utils/notification/Notifications"

const initialState = {
	filmName: "",
	filmDescription: "",
	type: "",
	genres: [],
	filmImage: "",
	filmBanner: "",
	episode: [],
	success: "",
	err: "",
}

function FilmUpload() {
	const auth = useSelector((state) => state.auth)
	const token = useSelector((state) => state.token)

	const [data, setData] = useState(initialState)
	// IMAGE
	const [selectedImage, setSelectedImage] = useState()
	const [preview, setPreview] = useState()
	// BANNER
	const [selectedBanner, setSelectedBanner] = useState()
	const [previewBanner, setPreviewBanner] = useState()

	const { filmName, filmDescription, type, genres, success, err } = data

	useEffect(() => {
		let objectUrlImage, objectUrlBanner

		if (selectedImage) {
			let objectUrlImage = URL.createObjectURL(selectedImage)
			setPreview(objectUrlImage)
		} else if (!selectedImage) setPreview(undefined)

		if (selectedBanner) {
			let objectUrlBanner = URL.createObjectURL(selectedBanner)
			setPreviewBanner(objectUrlBanner)
		} else if (!selectedBanner) setPreviewBanner(undefined)

		// free memory when ever this component is unmounted
		return () => {
			URL.revokeObjectURL(objectUrlImage)
			URL.revokeObjectURL(objectUrlBanner)
		}
	}, [selectedBanner, selectedImage])

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
		setData({ ...data, [name]: value, err: "", success: "" })
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
		setData({ ...data, genres: checkboxList, err: "", success: "" })
	}

	const handleSubmit = async () => {
		try {
			// -------------- IMAGE -----------
			if (!selectedImage)
				return setData({ ...data, err: "No file were uploaded", success: "" })
			if (selectedImage.size > 1024 * 1024 * 2)
				return setData({
					...data,
					err: "Size too large, limit < 2MB",
					success: "",
				})
			if (
				selectedImage.type !== "image/jpeg" &&
				selectedImage.type !== "image/png"
			) {
				return setData({
					...data,
					err: "File format is incorrect",
					success: "",
				})
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
			if (!selectedBanner)
				return setData({ ...data, err: "No file were uploaded", success: "" })
			if (selectedBanner.size > 1024 * 1024 * 5)
				return setData({
					...data,
					err: "Size too large, limit < 5MB",
					success: "",
				})
			if (
				selectedBanner.type !== "image/jpeg" &&
				selectedBanner.type !== "image/png"
			) {
				return setData({
					...data,
					err: "File format is incorrect",
					success: "",
				})
			}

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
							success: "Success create a film",
							err: "",
						})
						URL.revokeObjectURL(preview)
						URL.revokeObjectURL(previewBanner)
					}
				})
				.then(() => {
					setSelectedImage()
					setSelectedBanner()
				})
		} catch (err) {
			setData({ ...data, err: err.response.data.msg, success: "" })
		}
	}

	return (
		<>
			{err && showErrMsg(err)}
			{success && showSuccessMsg(success)}
			<div className="film-upload">
				<div className="form-group-upload">
					<label htmlFor="filmName">Film Name</label>
					<input
						type="text"
						name="filmName"
						id="filmName"
						placeholder="Enter film name"
						value={filmName}
						onChange={handleChange}
					/>
				</div>
				<div className="form-group-upload">
					<label htmlFor="filmDescription">Film Description</label>
					<textarea
						name="filmDescription"
						id="filmDescription"
						placeholder="Enter film description"
						value={filmDescription}
						onChange={handleChange}
					/>
				</div>
				<div className="form-group-upload" onChange={handleRadio}>
					<label htmlFor="type">Film Type</label>
					<input type="radio" id="movie-type" name="type" value="movie" />
					<label htmlFor="movie-type">Movie</label>
					<input type="radio" id="series-type" name="type" value="series" />
					<label htmlFor="series-type">Series</label>
				</div>

				<div className="form-group-upload" onChange={handleCheckbox}>
					<label htmlFor="category">Film Category</label>
					<input
						type="checkbox"
						id="action-genre"
						name="genre"
						value="Action"
					/>
					<label htmlFor="action-genre">Action</label>
					<input
						type="checkbox"
						id="comedy-genre"
						name="genre"
						value="Comedy"
					/>
					<label htmlFor="comedy-genre">Comedy</label>

					<input
						type="checkbox"
						id="mystery-genre"
						name="genre"
						value="Mystery"
					/>
					<label htmlFor="mystery-genre">Mystery</label>

					<input type="checkbox" id="drama-genre" name="genre" value="Drama" />
					<label htmlFor="drama-genre">Drama</label>

					<input
						type="checkbox"
						id="fantasy-genre"
						name="genre"
						value="Fantasy"
					/>
					<label htmlFor="fantasy-genre">Fantasy</label>

					<input
						type="checkbox"
						id="horror-genre"
						name="genre"
						value="Horror"
					/>
					<label htmlFor="horror-genre">Horror</label>

					<input
						type="checkbox"
						id="romance-genre"
						name="genre"
						value="Romance"
					/>
					<label htmlFor="romance-genre">Romance</label>

					<input
						type="checkbox"
						id="sci-fi-genre"
						name="sci-fi"
						value="Sci-fi"
					/>
					<label htmlFor="sci-fi-genre">Sci-fi</label>
				</div>

				<div className="film-upload-image">
					<div className="film-upload-image__title">Image for film</div>
					<div className="film-upload__holder-image">
						<input
							type="file"
							name="file"
							id="file_up"
							onChange={onSelectImage}
						/>
						{selectedImage && <img src={preview} alt="" />}
					</div>
				</div>
				<div className="film-upload-banner">
					<div className="film-upload-banner__title">Image banner</div>
					<div className="film-upload__holder-banner">
						<input
							type="file"
							name="file"
							id="file_up"
							onChange={onSelectBanner}
						/>
						{selectedBanner && <img src={previewBanner} alt="" />}
					</div>
				</div>
				<button onClick={handleSubmit}>Submit</button>
			</div>
		</>
	)
}

export default FilmUpload
