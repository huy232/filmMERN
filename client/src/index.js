import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { GoogleOAuthProvider } from "@react-oauth/google"
import DataProvider from "./redux/store"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	<DataProvider>
		<GoogleOAuthProvider clientId="1443508929-b9bctlau9f43j6auclk8mogci9ppicq6.apps.googleusercontent.com">
			<App />
		</GoogleOAuthProvider>
	</DataProvider>
)
