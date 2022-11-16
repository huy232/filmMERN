import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import "./subscription.css"

function Subscription() {
	const auth = useSelector((state) => state.auth)
	const customerStripeId = auth.user.stripeCustomerId
	const [userStatus, setUserStatus] = useState([])
	const [prices, setPrices] = useState([])

	useEffect(() => {
		if (customerStripeId) {
			const fetchSubsData = async () => {
				const userPayment = await axios.post("/payment/user-payment", {
					stripeCustomerId: customerStripeId,
				})
				setUserStatus(userPayment.data)

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
			{}
			<div className="subscription-plan">
				{prices &&
					prices.map((subs) => {
						return (
							<div className="subs" key={subs.id}>
								<div className="subs__price">
									{subs.unit_amount.toLocaleString("it-IT", {
										style: "currency",
										currency: "VND",
									})}
								</div>
								<div className="subs__name">{subs.nickname}</div>

								{userStatus.includes(`${subs.nickname}`) ? (
									<div className="own-plan">Owned</div>
								) : (
									<button
										className="subs__buy-now-btn"
										onClick={() => handlePayment(subs.id)}
									>
										Buy now
									</button>
								)}
							</div>
						)
					})}
			</div>
		</>
	)
}

export default Subscription
