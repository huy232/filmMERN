import React from "react"
import "./introduce.css"

function Introduce() {
	return (
		<div style={{ marginTop: "60px" }}>
			<div className="series-introduce">
				<img src="https://i.imgur.com/4UFUR5i.jpg" alt="" />
				<div className="overlay">
					<div className="series-introduce-content">
						<h2>Enjoy on your Series</h2>
						<p>Watch remembering journey, great plot, more.</p>
					</div>
				</div>
			</div>
			<div className="movie-introduce">
				<img src="https://i.imgur.com/Celur9V.jpg" alt="" />
				<div className="overlay">
					<div className="movie-introduce-content">
						<h2>Dive in interest Movie</h2>
						<p>Thrilling with action, romance, drama and more</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Introduce
