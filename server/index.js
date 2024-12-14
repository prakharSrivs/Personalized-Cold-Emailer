import("dotenv")
import { pool } from "./db/config.js";
import { scrapeLinkedinProfiles } from "./services/puppeteer/index.js";
import express from "express"
import cors from "cors"
import { createUserDataTable } from "./Schema/user_data.js";
import { createUserProfileTable } from "./Schema/user_profile.js";
import { loginUser, registerUser } from "./db/user_profile.js";
import { authenticate_jwt } from "./middlewares/auth_req.js";
const app = express();  

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Dev feature
app.get('/user/all', async(req, res) => {
    const result = await pool.query("SELECT * FROM user_profile");
    return res.json(result.rows)
})

app.post('/user/access', async (req,res) => {
    const { username, password } = req.body;
    const result = await pool.query("SELECT * FROM user_profile WHERE username = $1", [username]);
    if( result.rows.length == 0 ) {
        try {
            const user = await registerUser(username, password);
            return res.status(201).json(user);
        } catch (e) {
            return res.status(500).send("Internal Server Error");
        }
    } else {
        try{
            const user = await loginUser(username, password, result.rows[0]);
            return res.status(200).json(user);
        } catch (e) {
            if( e.message === "Invalid Credentials" ) return res.status(401).send("Invalid Credentials");
            return res.status(500).send("Internal Server Error");
        }
    }
})


app.get('/fetch/data', authenticate_jwt, (req, res) => {
    if( req?.isAuthenticated && req?.user_id ) {
        pool.query("SELECT * FROM user_data WHERE user_id = $1", [req.user_id], (error, result) => {
            if(error) return res.status(500).send("Error Fetching Results");
            return res.status(200).json(result.rows)
        })
    }
}) 

app.post('/process', authenticate_jwt, async (req, res) => {
    const { data } = req.body;
    if( !data ) return res.sendStatus(404)
    if( req?.isAuthenticated ) {
        await scrapeLinkedinProfiles(JSON.parse(data), req.user_id);
        return res.status(201).send("Data Created");
    }
})

// Dev - feature
app.get('/delete/all', async (req, res) => {
    const result = await pool.query('DELETE FROM user_data WHERE true', []);
    return res.sendStatus(200)
})

app.listen(3000, () => {
    console.log("Server started on PORT 3000");
})