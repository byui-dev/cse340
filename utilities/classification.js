const pool = require('../database/db');
// function to get classifications
async function getClassifications() {
    try {
        const result = await pool.query(
            "SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name"
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching classifications:", error);
        throw error;
    }   
}

module.exports = getClassifications;    