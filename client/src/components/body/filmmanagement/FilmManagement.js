import React, { useEffect, useState } from "react"
import axios from "axios"

function FilmManagement() {
	const [page, setPage] = useState(1)
	const [pageCount, setPageCount] = useState(0)
	const [filmType, setFilmType] = useState("")
	const [filmData, setFilmData] = useState()

	useEffect(() => {
		if (filmType === "movies") {
			getMovies()
		}
		if (filmType === "series") {
			getSeries()
		}
	}, [filmType, page])

	const getMovies = async () => {
		await axios.get(`/film/movies?page=${page}`).then((res) => {
			setFilmData(res.data.films)
			setPageCount(res.data.pagination.pageCount)
		})
	}

	const getSeries = async () => {
		await axios.get(`/film/series?page=${page}`).then((res) => {
			setFilmData(res.data.films)
			setPageCount(res.data.pagination.pageCount)
		})
	}

	const handleFilmType = (filmType) => {
		setPage(1)
		setFilmType(filmType)
	}

	const handlePrevious = () => {
		setPage((p) => {
			if (p === 1) return p
			return p - 1
		})
	}

	const handleNext = () => {
		setPage((p) => {
			if (p === pageCount) return p
			return p + 1
		})
	}
	return (
		<div className="film-management">
			<div className="film-management-type">
				<button onClick={() => handleFilmType("movies")}>Movies</button>
				<button onClick={() => handleFilmType("series")}>Series</button>
			</div>
			<div className="film-management-holder">
				{filmData &&
					filmData.map((product) => (
						<div className="movie-name" key={product._id}>
							{product.filmName}
						</div>
					))}
			</div>
			<footer>
				<button disabled={page === 1} onClick={handlePrevious}>
					Previous
				</button>
				<button disabled={page === pageCount} onClick={handleNext}>
					Next
				</button>
			</footer>
		</div>
	)
}

export default FilmManagement
