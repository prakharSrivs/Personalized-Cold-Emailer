import bcrypt from "bcrypt"
import { pool } from "./config.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config();

export async function loginUser(username, password, user) {
    const hash = user.password;
    const match = await bcrypt.compare(password, hash);
    if(match) {
        const token = jwt.sign({ user_id: user.user_id, username }, process.env.SECRET, { expiresIn: '10h' });
        return { user_id:user.user_id, token };
    } else {
        throw new Error("Invalid Credentials");
    }
}

export async function registerUser(username, password) {
    const salt = bcrypt.genSaltSync(11);
    const hash = bcrypt.hashSync(password, salt);
    const data = await pool.query(`
            INSERT INTO user_profile
            (username, password)
            VALUES ($1, $2)
            RETURNING user_id
        `, [username, hash]);

    if( !data?.rows || data.rows.length == 0 || !data.rows?.[0]?.user_id ) throw new Error("Internal Server Error")

    const token = jwt.sign({ user_id: data.rows[0].user_id, username }, process.env.SECRET, { expiresIn: '10h' })
    return {
        user_id: data.rows[0].user_id,
        token: token
    }
}