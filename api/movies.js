export default async function handler(req, res) {
    const { s, i } = req.query;

    if (!s && !i) {
        return res.status(400).json({
            Response: "False",
            Error: "Search query or IMDb ID is required"
        });
    }

    try {
        let url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}`;

        if (s) {
            url += `&s=${encodeURIComponent(s)}`;
        }

        if (i) {
            url += `&i=${encodeURIComponent(i)}&plot=full`;
        }

        const response = await fetch(url);
        const data = await response.json();

        return res.status(200).json(data);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            Response: "False",
            Error: "Something went wrong with the movie service"
        });
    }
}