import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import { Swiper, SwiperSlide } from "swiper/react/swiper-react"
import "swiper/swiper.min.css"
import "swiper/modules/pagination/pagination.min.css"
import "./slider.css"

function Slider({ type, customerStripeId }) {
	const auth = useSelector((state) => state.auth)
	const [prices, setPrices] = useState([])

	useEffect(() => {
		if (customerStripeId) {
			const fetchSubsData = async () => {
				const response = await axios.get("/payment/prices")
				setPrices(response.data.data)
			}

			fetchSubsData()
		}
	}, [customerStripeId])

	const handlePayment = async (priceId) => {
		const response = await axios.post("/payment/session", {
			email: auth.user.email,
			priceId,
		})

		window.location.href = response.data.url
	}

	return (
		<>
			{prices && (
				<Swiper className="subscription-slider">
					{prices.map((subs) => {
						return (
							<SwiperSlide key={subs.nickname}>
								<div
									className={
										subs.nickname === "Series"
											? `series-subscription`
											: `movie-subscription`
									}
								>
									<div className="overlay-subscription">
										<div className="overlay-inside">
											<h2>{`Get your ${subs.nickname}`}</h2>
											<div className="subs__describe">
												{subs.nickname === "Series" ? (
													<p>
														Hop in an exciting franchise and unpack many
														mysterious and plot-twisting stories you can never
														imagine. Subscribe monthly to access to our series.
													</p>
												) : (
													<p>
														Packing with action, drama, sci-fi, and many more,
														it gives you many satisfying hours to dive in and
														will bring you a lot of emotional moments. Subscribe
														monthly to access our movies.
													</p>
												)}
											</div>

											<div className="subs__bottom">
												<div className="subs__price">
													{subs.unit_amount.toLocaleString("it-IT", {
														style: "currency",
														currency: "VND",
													})}
												</div>
												{type.includes(`${subs.nickname}`) ? (
													<div className="own-plan">Owned</div>
												) : (
													<button
														className="subs__buy-now-btn"
														onClick={() => handlePayment(subs.id)}
													>
														Subscribe now
													</button>
												)}
											</div>
										</div>
									</div>

									<div className="iframe-holder">
										<iframe
											width="100%"
											height="300"
											src={
												subs.nickname === "Series"
													? "https://www.youtube.com/embed/d6kBeJjTGnY?autoplay=1&mute=1&loop=1&color=white&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&playlist=d6kBeJjTGnY"
													: "https://www.youtube.com/embed/1vxlbtzI1bc?autoplay=1&mute=1&loop=1&color=white&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&playlist=1vxlbtzI1bc"
											}
											title={
												subs.nickname === "Series"
													? `series-video`
													: `movie-video`
											}
											frameBorder="0"
											allow="autoplay"
										></iframe>
									</div>
								</div>
							</SwiperSlide>
						)
					})}
				</Swiper>
			)}
		</>
	)
}

export default Slider
