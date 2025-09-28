const { Pool } = require("pg")
require("dotenv").config()

/* ***************
 * Connection Pool
 * SSL Object needed for production environment (Render, Heroku, etc.)
 * *************** */
let pool

// Check if we're on Render or other cloud platform
const isProduction = process.env.NODE_ENV === "production" || process.env.DATABASE_URL?.includes("render.com")

if (isProduction) {
  console.log('Using PRODUCTION/CLOUD configuration with SSL')
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
} else {
  console.log('Using LOCAL development configuration')
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
}

// Export with query wrapper
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      if (!isProduction) {
        console.log("executed query", { text })
      }
      return res
    } catch (error) {
      console.error("error in query", { text })
      console.error("Pool config being used:", isProduction ? "PRODUCTION (with SSL)" : "DEVELOPMENT (no SSL)")
      throw error
    }
  },
  pool
}