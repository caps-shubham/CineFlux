const movieDetail = document.querySelector("#movie-detail");

const params = new URLSearchParams(location.search);
const imdbID = params.get("id");

if (imdbID) {
    searchMovie(imdbID.trim());
}


async function searchMovie(imdbID) {

    try {

        let response = await fetch(
            `/api/movies?i=${encodeURIComponent(imdbID)}`
        );

        let data = await response.json();

        console.log(data);

        if (data.Response === "True") {
            displayMovie(data);
        } else {
            console.log(data.Error);
        }

    } catch (error) {

        console.error(error);
    }
}


function displayMovie(data) {

    const favorite = isFavorite(data.imdbID);

    movieDetail.innerHTML = `
        <div>
            <img src="${data.Poster}" alt="">
        </div>

        <div>
            <div class="detail-header">
                <h2>${data.Title}</h2>

                <button
                    type="button"
                    id="favoriteBtnDetail"
                    class="favorite-btn-detail ${favorite ? "active" : ""}">
                    ${heartIcon(favorite)}
                    <span>${favorite ? "In Favorites" : "Add to Favorites"}</span>
                </button>
            </div>

            <section class="meta-row">
                <p>${data.Released}</p>
                <p>${data.Rated}</p>
                <p>${data.Runtime}</p>
                <p>${data.Genre}</p>
                <p class="rating-chip">IMDb: ${data.imdbRating} / 10</p>
            </section>

            <div class="info-block">
                <p class="info-label">Plot Overview</p>
                <p>${data.Plot}</p>
            </div>

            <div class="info-columns">
                <section>
                    <p class="info-label">Director</p>
                    <p>${data.Director}</p>
                </section>

                <section>
                    <p class="info-label">Writer</p>
                    <p>${data.Writer}</p>
                </section>
            </div>

            <div class="info-block">
                <p class="info-label">Actors</p>
                <p>${data.Actors}</p>
            </div>

            <div class="info-columns">
                <section>
                    <p class="info-label">Language</p>
                    <p>${data.Language}</p>
                </section>

                <section>
                    <p class="info-label">Country</p>
                    <p>${data.Country}</p>
                </section>
            </div>

            <a class="imdb-link" href="https://www.imdb.com/title/${data.imdbID}" target="_blank">
                View on IMDb
            </a>
        </div>
    `;

    const favoriteBtnDetail = document.querySelector("#favoriteBtnDetail");

    favoriteBtnDetail.addEventListener("click", () => {

        const movie = {
            imdbID: data.imdbID,
            Title: data.Title,
            Year: data.Year,
            Poster: data.Poster,
        };

        const nowFavorite = toggleFavorite(movie);

        favoriteBtnDetail.classList.toggle("active", nowFavorite);
        favoriteBtnDetail.innerHTML = `
            ${heartIcon(nowFavorite)}
            <span>${nowFavorite ? "In Favorites" : "Add to Favorites"}</span>
        `;
    });
}