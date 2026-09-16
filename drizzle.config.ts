import "dotenv/config"
import { defineConfig} from "drizzle-kit"

export default defineConfig({
    schema:"./src/model/*.ts",
    out:"./drizle",
    dialect:"postgresql",
    dbCredentials: {
        url:process.env.DATABASE_URL!,
    }
})