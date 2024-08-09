const getData = async (id) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`);
    const data = await response.json();
    return data;
}

export { getData };
