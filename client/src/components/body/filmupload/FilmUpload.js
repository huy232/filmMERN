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
	filmSlug: "",
	episode: [],
	success: "",
	err: "",
}

function FilmUpload() {
	const [data, setData] = useState(initialState)
	// IMAGE
	const [selectedImage, setSelectedImage] = useState()
	const [preview, setPreview] = useState()
	// BANNER
	const [selectedBanner, setSelectedBanner] = useState()
	const [previewBanner, setPreviewBanner] = useState()

	const {
		filmName,
		filmDescription,
		type,
		genres,
		filmImage,
		filmBanner,
		filmSlug,
		episode,
		success,
		err,
	} = data

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

		if (!selectedImage || !selectedBanner) {
			return
		}
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
		// I've kept this example simple by using the first image instead of multiple
		setSelectedImage(file)
	}

	const onSelectBanner = (e) => {
		e.preventDefault()
		if (!e.target.files || e.target.files.length === 0) {
			setSelectedBanner(undefined)
			return
		}
		const file = e.target.files[0]
		// I've kept this example simple by using the first image instead of multiple
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

	const handleSubmit = () => {}

	const handleCheckbox = (e) => {
		let checkboxList = [...genres]

		if (e.target.checked) {
			checkboxList = [...genres, { genre: e.target.value }]
		} else {
			checkboxList.splice(genres.indexOf(e.target.value), 1)
		}
		setData({ ...data, genres: checkboxList, err: "", success: "" })
	}

	return (
		<>
			{console.log(data)}
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
					<input
						type="text"
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
				</div>

				<div className="film-upload-image">
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
