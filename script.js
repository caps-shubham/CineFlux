const movieForm = document.querySelector("#movieForm");
const movieInput = document.querySelector("#movieInput");
const movieHub = document.querySelector("#movieHub");
const favoritesBtn = document.querySelector("#favoritesBtn");
const moodToggleBtn = document.querySelector("#moodToggleBtn");
const moodPanel = document.querySelector("#moodPanel");
const moodButtons = document.querySelectorAll(".mood-btn");

// Curated titles used to build mood-based suggestions.
// OMDB's search endpoint only matches on title, so each mood keeps a
// short list of well-known movies that fit that feeling.
const moodMovies = {
    happy: ["The Grand Budapest Hotel", "Paddington", "Sing Street", "Amelie", "School of Rock"],
    sad: ["The Pursuit of Happyness", "Manchester by the Sea", "Grave of the Fireflies", "A Star Is Born", "The Fault in Our Stars"],
    excited: ["Mad Max Fury Road", "John Wick", "Mission Impossible Fallout", "The Dark Knight", "Speed"],
    relaxed: ["The Secret Life of Walter Mitty", "Chef", "My Neighbor Totoro", "Julie and Julia", "About Time"],
    scared: ["Hereditary", "The Conjuring", "A Quiet Place", "Get Out", "It"],
    romantic: ["Pride and Prejudice", "La La Land", "Notting Hill", "The Notebook", "Before Sunrise"],
};

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

    if (!movies || movies.length === 0) {
        movieHub.innerHTML = `<p>No movies found.</p>`;
        return;
    }

    movies.forEach((movie) => {

        const div = document.createElement("div");

        div.dataset.imdbID = movie.imdbID;
        div.dataset.title = movie.Title;
        div.dataset.year = movie.Year;
        div.dataset.poster = movie.Poster;
        div.setAttribute("class", "movie-card");

        div.innerHTML = `
            <div>
                <img src="${movie.Poster}" alt="">

                <button
                    type="button"
                    class="favorite-btn ${isFavorite(movie.imdbID) ? "active" : ""}"
                    aria-label="Toggle favorite">
                    ${heartIcon(isFavorite(movie.imdbID))}
                </button>
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

    const favoriteBtn = e.target.closest(".favorite-btn");

    if (favoriteBtn) {
        toggleFavoriteFromCard(favoriteBtn);
        return;
    }

    const movieCard = e.target.closest(".movie-card");

    if (!movieCard) {
        return;
    }

    const imdbID = movieCard.dataset.imdbID;

    location.href = `movie-details.html?id=${imdbID}`;
});


function toggleFavoriteFromCard(button) {

    const card = button.closest(".movie-card");

    const movie = {
        imdbID: card.dataset.imdbID,
        Title: card.dataset.title,
        Year: card.dataset.year,
        Poster: card.dataset.poster,
    };

    const nowFavorite = toggleFavorite(movie);

    button.innerHTML = heartIcon(nowFavorite);
    button.classList.toggle("active", nowFavorite);
}


favoritesBtn.addEventListener("click", showFavorites);


function showFavorites() {

    const favorites = getFavorites();

    if (favorites.length === 0) {
        movieHub.innerHTML = `<p>No favorites yet. Tap the heart icon on a movie to save it here.</p>`;
        return;
    }

    displayMovies(favorites);
}


// If the details page links back here with ?view=favorites, open
// straight into the favorites list.
const initialParams = new URLSearchParams(location.search);

if (initialParams.get("view") === "favorites") {
    showFavorites();
}


moodToggleBtn.addEventListener("click", () => {
    const isOpen = !moodPanel.hidden;
    moodPanel.hidden = isOpen;
    moodToggleBtn.setAttribute("aria-expanded", String(!isOpen));
});


moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
        fetchMoodMovies(button.dataset.mood);

        // Collapse the mood picker once a choice is made so the
        // results have room to breathe.
        moodPanel.hidden = true;
        moodToggleBtn.setAttribute("aria-expanded", "false");
    });
});


async function fetchMoodMovies(mood) {

    const titles = moodMovies[mood];

    if (!titles) {
        return;
    }

    movieHub.innerHTML = `<span class="loader"></span>`;

    try {

        const responses = await Promise.all(
            titles.map((title) =>
                fetch(`/api/movies?s=${encodeURIComponent(title)}`).then((res) => res.json())
            )
        );

        const movies = responses
            .filter((data) => data.Response === "True" && data.Search && data.Search[0])
            .map((data) => data.Search[0]);

        displayMovies(movies);

    } catch (error) {

        console.error(error);
        movieHub.innerHTML = `<p>Something went wrong. Please try again.</p>`;
    }
}