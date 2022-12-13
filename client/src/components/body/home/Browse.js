import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react/swiper-react"
import "swiper/swiper.min.css"
import "swiper/modules/pagination/pagination.min.css"
import "./browse.css"

function Browse({ type, customerStripeId }) {
	const [page, setPage] = useState(1)
	const [pageCount, setPageCount] = useState(0)
	const [filmType, setFilmType] = useState("")
	const [filmData, setFilmData] = useState()
	const [searchMovie, setSearchMovie] = useState("")
	const [searchSeries, setSearchSeries] = useState("")
	const [submitSearchFilm, setSubmitSearchFilm] = useState("")
	const [genreOption, setGenreOption] = useState("")
	const [swiper, setSwiper] = useState(null)

	useEffect(() => {
		if (filmType === "movie") {
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
			slideTo(0)
			if (p === 1) return p
			return p - 1
		})
	}

	const handleNext = () => {
		setPage((p) => {
			slideTo(0)
			if (p === pageCount) return p
			return p + 1
		})
	}

	const handleSearchFilm = (e) => {
		const { value } = e.target
		if (filmType === "movie") {
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
		setPage(1)
		setSearchMovie("")
		setSearchSeries("")
	}

	const handleGenresOption = (e) => {
		const { value } = e.target
		setPage(1)
		setGenreOption(value)
	}

	const slideTo = (index) => {
		if (swiper) swiper.slideTo(index)
	}

	return (
		<>
			{type.length > 0 && (
				<div className="film-browse">
					<div className="film-browse-type">
						{type.map((filmType) => (
							<button
								onClick={() => handleFilmType(filmType.toLowerCase())}
								key={filmType}
							>
								{filmType}
							</button>
						))}
					</div>
					<div className="film-browse-utilities">
						{filmType === "movie" && (
							<>
								<div className="film-browse__movie-search">
									<label htmlFor="movie-search">Movie </label>
									<input
										type="search"
										id="movie-search"
										name="movie-search"
										value={searchMovie}
										onChange={handleSearchFilm}
									/>
									<button onClick={() => handleSearch(searchMovie)}>
										Search
									</button>
								</div>

								<div className="film-browse__genres-movie">
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
								<div className="film-browse__series-search">
									<label htmlFor="series-search">Series </label>
									<input
										type="search"
										id="series-search"
										name="series-search"
										value={searchSeries}
										onChange={handleSearchFilm}
									/>
									<button onClick={() => handleSearch(searchSeries)}>
										Search
									</button>
								</div>

								<div className="film-browse__genres-series">
									<label htmlFor="series-genre">Genre</label>

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
					</div>
					{filmType === "movie" || filmType === "series" ? (
						<>
							<div className="film-browse-holder">
								<Swiper
									direction={"vertical"}
									pagination={{
										clickable: true,
									}}
									modules={[Pagination]}
									className="film-swiper"
									onSwiper={setSwiper}
								>
									{filmData &&
										filmData.map((product) => (
											<SwiperSlide
												key={product._id}
												className="film-swiper-slide"
												style={{
													backgroundImage: `url(${product.filmBanner})`,
													backgroundRepeat: "no-repeat",
													backgroundAttachment: "fixed",
													backgroundSize: "cover",
												}}
											>
												<div className="film">
													<div className="film-browse__image">
														<img
															src={product.filmImage}
															alt={product.filmName}
														/>
													</div>
													<div className="film-browse__name">
														{product.filmName}
													</div>
												</div>

												<div className="film-browse__right-wrapper">
													<div className="film-browse__description">
														<p>{product.filmDescription}</p>
													</div>

													<div className="film-browse__utils">
														<Link to={`/film-info/${product.filmSlug}`}>
															<button className="watch-now">
																DIVE IN{" "}
																<i className="far fa-hand-point-right"></i>
															</button>
														</Link>
													</div>
												</div>
											</SwiperSlide>
										))}
								</Swiper>
							</div>
							<footer className="pagination-section">
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
						</>
					) : (
						""
					)}
				</div>
			)}
		</>
	)
}

export default Browse
