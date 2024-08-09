import React, { useEffect, useState } from "react";
import "./movie.css";
import Cards from "../../components/card/card";
import { getData } from "../../utils/getData";
import { useParams } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const Movie = () => {
  const [currentMovieDetail, setMovie] = useState();
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // setIsLoading=true;
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [id]);

  useEffect(() => {
    // const ac = new AbortController();
    async function fetchData() {
      let data = await getData(id);
      setMovie(data);
    }
    fetchData();
    window.scrollTo(0, 0);
    // return () => ac.abort();
  }, [id]);

 

  useEffect(() => {
    // const ac = new AbortController();
    if (currentMovieDetail) {
      async function fetchData() {
        const res = await fetch(
          `http://127.0.0.1:5000/recommend?movie=${encodeURIComponent(
            currentMovieDetail.title
          )}`
        );
        const movies_id = await res.json();
        const moviesPromises = movies_id.map((id) => getData(id));
        const moviesData = await Promise.all(moviesPromises);
        setRecommendedMovies(moviesData);
      }
      fetchData();
    }
    // return () => ac.abort();
  }, [currentMovieDetail]);

  return isLoading ? (
    <>
    <div className="movie">
      <div className="movie__intro">
        <div className="movie__backdrop">
          <SkeletonTheme color="#202020" highlightColor="#444">
            <Skeleton height={500} duration={2} />
          </SkeletonTheme>
        </div>
      </div>
      </div>
      <div className="movie">
      <div className="movie__detail">
        <div className="movie__detailLeft">
          <div className="movie__posterBox">
            <div className="movie__posterBox">
              <SkeletonTheme color="#202020" highlightColor="#444">
                <Skeleton height={450} width={300} duration={2} />
              </SkeletonTheme>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  ) : (
    <div className="movie">
      <div className="movie__intro">
        <img
          className="movie__backdrop"
          src={`https://image.tmdb.org/t/p/original${
            currentMovieDetail ? currentMovieDetail.backdrop_path : ""
          }`}
        />
      </div>
      <div className="movie__detail">
        <div className="movie__detailLeft">
          <div className="movie__posterBox">
            <img
              className="movie__poster"
              src={`https://image.tmdb.org/t/p/original${
                currentMovieDetail ? currentMovieDetail.poster_path : ""
              }`}
            />
          </div>
        </div>
        <div className="movie__detailRight">
          <div className="movie__detailRightTop">
            <div className="movie__name">
              {currentMovieDetail ? currentMovieDetail.original_title : ""}
            </div>
            <div className="movie__tagline">
              {currentMovieDetail ? currentMovieDetail.tagline : ""}
            </div>
            <div className="movie__rating">
              {currentMovieDetail ? currentMovieDetail.vote_average.toFixed(1) : ""}{" "}
              <i class="fas fa-star" />
              {/* <span className="movie__rating">
                {currentMovieDetail
                  ? "(" + currentMovieDetail.vote_count + ") votes"
                  : ""}
              </span> */}
              <span className="info">
              {currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}
            </span>
            <span className="info">
              {currentMovieDetail
                ? "Release date: " + currentMovieDetail.release_date
                : ""}
            </span>
            </div>
            
            <div className="movie__genres">
              {currentMovieDetail && currentMovieDetail.genres
                ? currentMovieDetail.genres.map((genre) => (
                    <>
                      <span className="movie__genre" id={genre.id}>
                        {genre.name}
                      </span>
                    </>
                  ))
                : ""}
            </div>
          </div>
          <div className="movie__detailRightBottom">
            <div className="synopsisText">Synopsis</div>
            <div className="overview">{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
          </div>
        </div>
      </div>

      <div className="movie__links">
        <div className="movie__heading">Useful Links</div>
        {currentMovieDetail && currentMovieDetail.homepage && (
          <a
            href={currentMovieDetail.homepage}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <p>
              <span className="movie__homeButton movie__Button">
                Homepage <i className="newTab fas fa-external-link-alt"></i>
              </span>
            </p>
          </a>
        )}
        {currentMovieDetail && currentMovieDetail.imdb_id && (
          <a
            href={"https://www.imdb.com/title/" + currentMovieDetail.imdb_id}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <p>
              <span className="movie__imdbButton movie__Button">
                IMDb<i className="newTab fas fa-external-link-alt"></i>
              </span>
            </p>
          </a>
        )}
      </div>

      {currentMovieDetail &&
        currentMovieDetail.production_companies &&
        currentMovieDetail.production_companies.length > 0 &&
        currentMovieDetail.production_companies[0].logo_path && (
          <>
            <div className="movie__heading">Production companies</div>
          </>
        )}
      <div className="movie__production">
        {currentMovieDetail &&
          currentMovieDetail.production_companies &&
          currentMovieDetail.production_companies.map((company) => (
            <>
              {company.logo_path && (
                <div className="productionCompanyImage">
                  <div  className="movie__productionComapany">
                  <img
                   
                    src={
                      "https://image.tmdb.org/t/p/original" + company.logo_path
                    }
                  />
                  </div>
                  <span className="productionCompanyName">{company.name.slice(0,20)}</span>
                </div>
              )}
            </>
          ))}
      </div>

      {recommendedMovies && recommendedMovies.length > 0 && (
        <>
          <div className="movie__heading">Recommendations</div>
          <div>
            <div className="movie__production_recommended">
              {recommendedMovies.map((movie) => (
                <Cards key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Movie;
