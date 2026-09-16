// import { drizzle } from "drizzle-orm/node-postgres";
// import "dotenv/config"
// import { Pool} from "pg"

// export const pool = new Pool({
//     connectionString:process.env.DATABASE_URL!,
//     max:10,
//     idleTimeoutMillis:3000
// });

// export const db = drizzle({
//     client:pool
// });

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";

const sql = neon(env.DATABASE_URL)

export const db = drizzle({
    client:sql,
})