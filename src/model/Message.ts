import { pgTable, timestamp,text,uuid} from "drizzle-orm/pg-core";
import { user } from "./User";

const message = pgTable("message",{

    id: uuid("id")
    .primaryKey()
    .defaultRandom(),
    

    content:text("content")
    .notNull(),

    receiver_id:text("receiver_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

    

    created_at: timestamp("created_at",{ withTimezone: true})
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date),
})
export {
    message
}
export type Message = typeof message.$inferSelect