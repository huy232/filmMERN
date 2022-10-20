import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function FilmManagement() {
	const [page, setPage] = useState(1)
	const [pageCount, setPageCount] = useState(0)
	const [filmType, setFilmType] = useState("")
	const [filmData, setFilmData] = useState()
	const [searchMovie, setSearchMovie] = useState("")
	const [searchSeries, setSearchSeries] = useState("")
	const [submitSearchFilm, setSubmitSearchFilm] = useState("")
	const navigate = useNavigate()

	useEffect(() => {
		if (filmType === "movies") {
			getMovies()
		}
		if (filmType === "series") {
			getSeries()
		}
	}, [filmType, page, submitSearchFilm])

	const getMovies = async () => {
		await axios
			.get(`/film/movies?page=${page}&filmName=${submitSearchFilm}`)
			.then((res) => {
				setFilmData(res.data.films)
				setPageCount(res.data.pagination.pageCount)
			})
	}

	const getSeries = async () => {
		await axios
			.get(`/film/series?page=${page}&filmName=${submitSearchFilm}`)
			.then((res) => {
				setFilmData(res.data.films)
				setPageCount(res.data.pagination.pageCount)
			})
	}

	const handleFilmType = (filmType) => {
		setPage(1)
		setSubmitSearchFilm("")
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

	const handleSearchFilm = (e) => {
		const { value } = e.target
		if (filmType === "movies") {
			setSearchSeries("")
			setSearchMovie(value)
		}
		if (filmType === "series") {
			setSearchMovie("")
			setSearchSeries(value)
		}
	}

	const handleSearch = (searchInput) => {
		setSubmitSearchFilm(searchInput)
		setSearchMovie("")
		setSearchSeries("")
	}

	const handleAddEpisode = (_id) => {
		navigate(`/add-episode/${_id}`)
	}

	return (
		<div className="film-management">
			<div className="film-management-type">
				<button onClick={() => handleFilmType("movies")}>Movies</button>
				<button onClick={() => handleFilmType("series")}>Series</button>
			</div>
			<div className="film-management__search-input">
				{filmType === "movies" && (
					<>
						<label htmlFor="movie-search">Search movie:</label>
						<input
							type="search"
							id="movie-search"
							name="movie-search"
							value={searchMovie}
							onChange={handleSearchFilm}
						/>
						<button onClick={() => handleSearch(searchMovie)}>Search</button>
					</>
				)}
				{filmType === "series" && (
					<>
						<label htmlFor="series-search">Search series:</label>
						<input
							type="search"
							id="series-search"
							name="series-search"
							value={searchSeries}
							onChange={handleSearchFilm}
						/>
						<button onClick={() => handleSearch(searchSeries)}>Search</button>
					</>
				)}
			</div>
			<div className="film-management-holder">
				{filmData &&
					filmData.map((product) => (
						<div className="film" key={product._id}>
							<div className="film-management__image">
								<img src={product.filmImage} alt={product.filmName} />
							</div>
							<div className="film-management__name">{product.filmName}</div>
							<div className="film-management__utils">
								<button>
									<i
										className="far fa-edit"
										onClick={() => {
											handleAddEpisode(product._id)
										}}
									>
										Add episode
									</i>
								</button>
								<button>
									<i className="far fa-edit"> Edit</i>
								</button>
								<button>
									<i className="far fa-edit"> Delete</i>
								</button>
							</div>
						</div>
					))}
			</div>
			<footer>
				<button disabled={page === 1} onClick={handlePrevious}>
					Previous
				</button>
				<button
					disabled={page === 0 || page === pageCount}
					onClick={handleNext}
				>
					Next
				</button>
			</footer>
		</div>
	)
}

export default FilmManagement
