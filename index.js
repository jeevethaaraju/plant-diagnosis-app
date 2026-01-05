import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

/* -----------------------------------------
   GET TRIPS (FETCH ALL PAGES)
------------------------------------------ */
app.get("/getTrips", async (req, res) => {
    const { state, activity, keyword = "" } = req.query;

    if (!state) return res.json([]);

    let allResults = [];
    let pageToken = null;

    try {
        do {
            let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
                `${keyword || activity} places in ${state}, Malaysia`
            )}&key=${GOOGLE_API_KEY}`;

            if (pageToken) {
                url += `&pagetoken=${pageToken}`;
                await new Promise(r => setTimeout(r, 2000)); // REQUIRED by Google
            }

            const resp = await fetch(url);
            const data = await resp.json();

            if (data.results) {
                allResults.push(...data.results);
            }

            pageToken = data.next_page_token || null;

        } while (pageToken);

        const formatted = allResults.map(place => ({
            name: place.name,
            address: place.formatted_address,
            imageUrl: place.photos
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
                : null,
            mapLink: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            website: place.website || null
        }));

        res.json(formatted);

    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

app.listen(3000, () =>
    console.log("✅ Backend running at http://localhost:3000")
);
