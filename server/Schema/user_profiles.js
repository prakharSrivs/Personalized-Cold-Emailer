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
