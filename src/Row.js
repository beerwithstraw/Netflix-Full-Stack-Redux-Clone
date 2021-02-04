import React, { useEffect, useState } from 'react'
import ScrollContainer from "react-indiana-drag-scroll";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer/index";
import axios from './axios'
import './Row.css'

function Row({ title, fetchUrl, isLargeRow = false }) {

    const [movies, setMovies] = useState([])
    const [trailerUrl, setTrailerUrl] = useState("");

    const base_url = "https://image.tmdb.org/t/p/original/"

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }

        fetchData()
    }, [fetchUrl])

    const youtubeOptions = {
        height: "490",
        width: "70%",
        playerVars: {
          autoplay: 1,
        },
    };

    const movieClicked = (moviename) => {
        console.log(moviename);
        if (trailerUrl !== "") setTrailerUrl("");
        else {
          movieTrailer(moviename)
            .then((url) => {
              const urlParamV = new URLSearchParams(new URL(url).search);
              setTrailerUrl(urlParamV.get("v"));
            })
            .catch((err) => console.log(err));
        }
      };

    return (
        <div className="row">
            <h2>{title}</h2>

            <ScrollContainer className="row__posters">           
                {movies.map((movie) => (
                    (isLargeRow && movie.poster_path) || (!isLargeRow && movie.backdrop_path)) && (
                        <img className={`row__poster ${isLargeRow && "row__posterLarge"}`} 
                        key={movie.id}
                        onClick={() =>
                            movieClicked(movie.name || movie.title || movie.orginal_name)
                          }
                        src={`${base_url}${
                            isLargeRow ? movie.poster_path : movie.backdrop_path
                        }`} alt={movie.name}/>
                    )
                
                )}
            </ScrollContainer>
            {trailerUrl !== "" && <YouTube className="trailer" videoId={trailerUrl} opts={youtubeOptions} />}

        </div>
    )
}

export default Row
