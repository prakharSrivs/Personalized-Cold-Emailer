import { pool } from "../db/config.js";

export async function createUserDataTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS user_data (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
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
