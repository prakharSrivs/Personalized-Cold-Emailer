import("dotenv")
import { pool } from "./db/config.js";
import { scrapeLinkedinProfiles } from "./services/puppeteer/index.js";
import express from "express"
const app = express();  

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/fetch/data', (req, res) => {
    pool.query("SELECT * FROM user_profiles", [], (error, result) => {
        if(error) return res.status(500).send("Error Fetching Results");
        return res.status(200).json(result.rows)
    })
})

app.post('/process',async (req, res) => {
    const { data } = req.body;
    await scrapeLinkedinProfiles(JSON.parse(data));
    return res.sendStatus(201);
})

// Dev - feature
app.get('/delete/all', async (req, res) => {
    const result = await pool.query('DELETE FROM user_profiles WHERE status = $1', ['PROFILE_EXTRACTED']);
    return res.sendStatus(200)
})

app.listen(3000, () => {
    console.log("Server started on PORT 3000");
})


// const rawData = readExcelFile('./inputFile.xlsx');
// const data = cleanData(rawData);


// console.log(scrapeLinkedinProfiles(data));