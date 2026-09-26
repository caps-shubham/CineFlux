// favorites.js — shared favorites storage used by script.js and movie-details.js.
// Favorites are stored in localStorage as a plain array of movie objects
// shaped like { imdbID, Title, Year, Poster }.

const FAVORITES_KEY = "cinefluxFavorites";

function getFavorites() {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isFavorite(imdbID) {
    return getFavorites().some((movie) => movie.imdbID === imdbID);
}

function toggleFavorite(movie) {
    let favorites = getFavorites();

    if (isFavorite(movie.imdbID)) {
        favorites = favorites.filter((m) => m.imdbID !== movie.imdbID);
    } else {
        favorites.push(movie);
    }

    saveFavorites(favorites);
    return isFavorite(movie.imdbID);
}

function heartIcon(filled) {
    return `
        <svg class="heart-icon" viewBox="0 0 24 24" fill="${filled ? "currentColor" : "none"}"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.1 1.6 6.7 4.6 5.2c2.4-1.2 5 .1 6.4 2.3 1.4-2.2 4-3.5 6.4-2.3 3 1.5 3.6 4.9 1.9 7.7C18.7 16.65 12 21 12 21z" />
        </svg>
    `;
}