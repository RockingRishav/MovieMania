import React, { useEffect, useState } from "react";
import "./recommend.css";
import Cards from "../../components/card/card";
import { getData } from "../../utils/getData";
import { Link } from "react-router-dom";
import MovieList from "../../components/movieList/movieList";



const Recommend = () => {
    const [list, setList] = useState([]);
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoadingList(true);
        fetch('http://localhost:5000/list')
            .then(response => response.json())
            .then(data => {
                setList(data);
                setLoadingList(false);
            })
            .catch(error => {
                console.error('Error fetching the list:', error);
                setError('Error fetching the list of movies.');
                setLoadingList(false);
            });
    }, []);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value) {
            const results = list.filter(movie => 
                movie[1].toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectMovie = async (movieTitle) => {
        setSearchTerm(movieTitle);
        setSearchResults([]);
        setLoadingRecommendations(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/recommend?movie=${encodeURIComponent(movieTitle)}`);
            if (!response.ok) {
                throw new Error('Error fetching the recommendations');
            }
            const ids = await response.json();
            const dataPromises = ids.map(id => getData(id));
            const data = await Promise.all(dataPromises);
            setRecommendedMovies(data);
        } catch (error) {
            console.error('Error fetching the recommendations:', error);
            setError('Error fetching recommendations for the selected movie.');
        } finally {
            setLoadingRecommendations(false);
        }
    };

    const renderSearchResults = () => {
        return searchResults.map((movie) => (
            <li key={movie[0]} onClick={() => handleSelectMovie(movie[1])}>
                {movie[1]}
            </li>
        ));
    };

    return (
        <>
        <div className="recommend-container">
            <input 
                type="text" 
                placeholder="Search for a movie..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
            />
            {searchResults.length > 0 && (
                <ul className="search-results">
                    {renderSearchResults()}
                </ul>
            )}
            {loadingList && <p>Loading movies...</p>}
            {error && <p className="error">{error}</p>}
            <div className="movie__heading">Recommendations</div>
            {loadingRecommendations ? (
                <p>Loading recommendations...</p>
            ) : (
                recommendedMovies.length > 0 ? (
                    <div className="movie__production">
                        {recommendedMovies.map(movie => (
                            <Cards key={movie.id} movie={movie} />

                        ))}
                    </div>
                ) : (
                    <p>No recommendations available. Please search for a movie.</p>
                )
            )}
        </div>
        <MovieList />
        </>
    );
}

export default Recommend;
