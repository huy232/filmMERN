import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

function FilmAddEpisode() {
	const { _id } = useParams()

	const [film, setFilm] = useState()

	useEffect(() => {}, [_id])

	return <div>{console.log(_id)}</div>
}

export default FilmAddEpisode
