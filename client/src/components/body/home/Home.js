import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import Browse from "./Browse"
import Introduce from "./Introduce"
import Slider from "./Slider"

function Home() {
	const [userStatus, setUserStatus] = useState([])

	const token = useSelector((state) => state.token)
	const auth = useSelector((state) => state.auth)
	const customerStripeId = auth.user.stripeCustomerId
	useEffect(() => {
		if (customerStripeId) {
			const paymentCheck = async () => {
				const userPayment = await axios.post("/payment/user-payment", {
					stripeCustomerId: customerStripeId,
				})
				setUserStatus(userPayment.data)
			}

			paymentCheck()
		}
	}, [customerStripeId])

	return (
		<>
			{token && customerStripeId ? (
				<>
					<Slider type={userStatus} customerStripeId={customerStripeId} />
					<Browse type={userStatus} customerStripeId={customerStripeId} />
				</>
			) : (
				<Introduce />
			)}
		</>
	)
}

export default Home
