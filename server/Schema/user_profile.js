import { pool } from "../db/config.js";

export async function createUserProfileTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS user_profile (
            user_id SERIAL PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL
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
