import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import "./filmmanagement.css"

function FilmManagement() {
	const [page, setPage] = useState(1)
	const [pageCount, setPageCount] = useState(0)
	const [filmType, setFilmType] = useState("")
	const [filmData, setFilmData] = useState()
	const [searchMovie, setSearchMovie] = useState("")
	const [searchSeries, setSearchSeries] = useState("")
	const [submitSearchFilm, setSubmitSearchFilm] = useState("")
	const [genreOption, setGenreOption] = useState("")
	const navigate = useNavigate()

	useEffect(() => {
		if (filmType === "movies") {
			const getMovies = async () => {
				await axios
					.get(
						`/film/movies?page=${page}&filmName=${submitSearchFilm}&genre=${genreOption}`
					)
					.then((res) => {
						setFilmData(res.data.films)
						setPageCount(res.data.pagination.pageCount)
					})
			}

			getMovies()
		}
		if (filmType === "series") {
			const getSeries = async () => {
				await axios
					.get(
						`/film/series?page=${page}&filmName=${submitSearchFilm}&genre=${genreOption}`
					)
					.then((res) => {
						setFilmData(res.data.films)
						setPageCount(res.data.pagination.pageCount)
					})
			}

			getSeries()
		}
	}, [filmType, page, submitSearchFilm, genreOption])

	const handleFilmType = (filmType) => {
		setPage(1)
		setGenreOption("")
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

	const handleAddTrailer = (_id) => {
		navigate(`/add-trailer/${_id}`)
	}

	const handleGenresOption = (e) => {
		const { value } = e.target
		setPage(1)
		setGenreOption(value)
	}

	const handleDeleteEpisode = async (filmId) => {
		await axios.delete(`/film/delete-film/${filmId}`)
		setPage(1)
	}

	return (
		<div className="film-management">
			<div className="film-management-type">
				<button onClick={() => handleFilmType("movies")}>Movies</button>
				<button onClick={() => handleFilmType("series")}>Series</button>
			</div>
			<div className="film-management-utilities">
				{filmType === "movies" && (
					<>
						<div className="film-management__movie-search">
							<label htmlFor="movie-search">Movie </label>
							<input
								type="search"
								id="movie-search"
								name="movie-search"
								value={searchMovie}
								onChange={handleSearchFilm}
							/>
							<button onClick={() => handleSearch(searchMovie)}>Search</button>
						</div>

						<div className="film-management__genres-movie">
							<label htmlFor="movie-genres">Genre </label>

							<select
								id="genres"
								onChange={(e) => handleGenresOption(e)}
								value={genreOption}
							>
								<option value="">All</option>
								<option value="Action">Action</option>
								<option value="Comedy">Comedy</option>
								<option value="Mystery">Mystery</option>
								<option value="Drama">Drama</option>
								<option value="Fantasy">Fantasy</option>
								<option value="Horror">Horror</option>
								<option value="Romance">Romance</option>
								<option value="Sci-fi">Sci-fi</option>
							</select>
						</div>
					</>
				)}
				{filmType === "series" && (
					<>
						<div className="film-management__series-search">
							<label htmlFor="series-search">Series </label>
							<input
								type="search"
								id="series-search"
								name="series-search"
								value={searchSeries}
								onChange={handleSearchFilm}
							/>
							<button onClick={() => handleSearch(searchSeries)}>Search</button>
						</div>
						<div className="film-management__genres-series">
							<label htmlFor="series-genre">Genre </label>

							<select id="genres" onChange={(e) => handleGenresOption(e)}>
								<option value="">All</option>
								<option value="Action">Action</option>
								<option value="Comedy">Comedy</option>
								<option value="Mystery">Mystery</option>
								<option value="Drama">Drama</option>
								<option value="Fantasy">Fantasy</option>
								<option value="Horror">Horror</option>
								<option value="Romance">Romance</option>
								<option value="Sci-fi">Sci-fi</option>
							</select>
						</div>
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
							<div className="film-management__name" title={product.filmName}>
								{product.filmName}
							</div>
							<div
								className="film-management__utils"
								style={{ display: "flex", flexDirection: "column" }}
							>
								<button>
									<i
										className="fas fa-plus-square"
										onClick={() => {
											handleAddEpisode(product._id)
										}}
									>
										{" "}
										Add episode
									</i>
								</button>
								<button
									onClick={() => {
										handleAddTrailer(product._id)
									}}
								>
									<i className="fas fa-trailer"> Add trailer</i>
								</button>
								<button>
									<Link
										to={`/film-management/${product._id}`}
										style={{ color: "black" }}
									>
										<i className="far fa-edit"> Edit</i>
									</Link>
								</button>
								<button onClick={() => handleDeleteEpisode(product._id)}>
									<i className="fas fa-minus-square"> Delete</i>
								</button>
							</div>
						</div>
					))}
			</div>
			{filmType === "series" || filmType === "movies" ? (
				<footer className="film-management-pagination">
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
			) : (
				""
			)}
		</div>
	)
}

export default FilmManagement
