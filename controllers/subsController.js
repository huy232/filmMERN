const Users = require("../models/userModel")
const { CLIENT_URL } = process.env
const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2022-08-01",
})

const subsController = {
	stripePrices: async (req, res) => {
		const prices = await stripe.prices.list({
			apiKey: process.env.STRIPE_SECRET_KEY,
		})

		return res.json(prices)
	},
	stripeSession: async (req, res) => {
		const { email, priceId } = req.body
		console.log({ email: email, priceId: priceId })
		const user = await Users.findOne({ email })
		const session = await stripe.checkout.sessions.create(
			{
				mode: "subscription",
				payment_method_types: ["card"],
				line_items: [
					{
						price: priceId,
						quantity: 1,
					},
				],
				success_url: `${CLIENT_URL}/success-payment`,
				cancel_url: `${CLIENT_URL}/cancel-payment`,
				customer: user.stripeCustomerId,
			},
			{
				apiKey: process.env.STRIPE_SECRET_KEY,
			}
		)

		return res.json(session)
	},
}

module.exports = subsController
