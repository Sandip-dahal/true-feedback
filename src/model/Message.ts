import { pgTable, timestamp,text} from "drizzle-orm/pg-core";


const message = pgTable("message",{

    content:text("content")
    .notNull(),
    

    created_at: timestamp("created_at",{ withTimezone: true})
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date),
})
export {
    message
}