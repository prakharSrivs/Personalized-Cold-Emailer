import { pool } from "./config.js";

export async function updateColdEmailContent(coldEmailContent, linkedinProfileUrl) {
    try{ 
        await pool.query(
            `UPDATE user_profiles 
            SET cold_email_content = $1, status = 'COLD_EMAIL_CONTENT_CREATED' 
            WHERE linkedin_profile_url = $2`,
            [coldEmailContent, linkedinProfileUrl]
        );
    } catch (e) {
        console.log("Error");
        throw new Error("Error Updating Data")
    }
}

export async function updateProfileSummary(linkedinProfileUrl, mobileNumber, summary) {
    const results = await pool.query('SELECT * FROM user_profiles WHERE linkedin_profile_url = $1', [linkedinProfileUrl]);

    try{
        if( results.rows.length > 0 ) {
            await pool.query(
                `UPDATE user_profiles 
                SET profile_content=$1, status = 'PROFILE_EXTRACTED'
                WHERE linkedin_profile_url = $2`,
                [summary, linkedinProfileUrl]
            )
        } else {        
            await pool.query(
                `INSERT INTO user_profiles 
                (linkedin_profile_url, mobile_number, profile_content, cold_email_content, status)
                VALUES ($1, $2, $3, $4, $5)`, 
                [linkedinProfileUrl, mobileNumber, summary, "", "PROFILE_EXTRACTED"]
            );
        }
    } catch(e) {
        console.log(e);
        throw new Error(e.message);
    }
}