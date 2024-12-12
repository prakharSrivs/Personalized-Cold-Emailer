import("dotenv")
import { pool } from "./db/config.js";
import { scrapeLinkedinProfiles } from "./services/puppeteer/index.js";
import { cleanData, readExcelFile } from "./utils.js";
import express from "express"
const app = express();  

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

async function createTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS user_profiles (
            user_id SERIAL PRIMARY KEY,
            linkedin_profile_url TEXT NOT NULL,
            mobile_number TEXT NOT NULL,
            profile_content TEXT,
            cold_email_content TEXT,
            status TEXT DEFAULT 'PENDING'
        );
    `;
    try {
        const client = await pool.connect();
        console.log("Connected")
        await pool.query(query);
        console.log('Table created successfully');
        client.release();
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

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

app.listen(3000, () => {
    console.log("Server started on PORT 3000");
})


const rawData = readExcelFile('./inputFile.xlsx');
const data = cleanData(rawData);


// console.log(scrapeLinkedinProfiles(data));