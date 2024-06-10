import dotenv from 'dotenv'

dotenv.config(
    {
        path: "./src/.env",
        override: true
    }
)
export const config = {
    PORT: process.env.PORT || 3000, 
    MONGO_URL: process.env.MONGO_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    EUS_AD: process.env.EUS_AD,
    PA_AD: process.env.PA_AD,
    GITHUB_CID: process.env.GITHUB_CID,
    GITHUB_CS: process.env.GITHUB_CS,
    GITHUB_CURL: process.env.GITHUB_CURL
}