const movieForm = document.querySelector("#movieForm");
const movieInput = document.querySelector("#movieInput");
const movieHub = document.querySelector("#movieHub");

movieForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let query = movieInput.value.trim();

    if (!query) {
        return;
    }

    console.log(query);
    searchMovies(query);
});


async function searchMovies(movieName) {

    movieHub.innerHTML = `<span class="loader"></span>`;

    try {

        let response = await fetch(
            `/api/movies?s=${encodeURIComponent(movieName)}`
        );

        let data = await response.json();

        console.log(data);

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            console.log(data.Error);
            movieHub.innerHTML = `<p>${data.Error}</p>`;
        }

    } catch (error) {

        console.error(error);
        movieHub.innerHTML = `<p>Something went wrong. Please try again.</p>`;
    }
}


function displayMovies(movies) {

    movieHub.innerHTML = "";

    movies.forEach((movie) => {

        const div = document.createElement("div");

        div.dataset.imdbID = movie.imdbID;
        div.setAttribute("class", "movie-card");

        div.innerHTML = `
            <div>
                <img src="${movie.Poster}" alt="">
            </div>

            <div>
                <p>${movie.Title}</p>
                <p>${movie.Year}</p>
            </div>
        `;

        movieHub.append(div);
    });
}


movieHub.addEventListener("click", (e) => {

    e.stopPropagation();

    const movieCard = e.target.closest(".movie-card");

    if (!movieCard) {
        return;
    }

    const imdbID = movieCard.dataset.imdbID;

    location.href = `movie-details.html?id=${imdbID}`;
});