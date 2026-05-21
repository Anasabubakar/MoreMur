/**
 * Apply database schema only — no demo users, orgs, posts, or comments.
 * Orgs and users are created through signup (resolveOrgForDomain).
 */
import "../load-env.js";
import { closeDb, initDb } from "./index.js";

await initDb();
console.log("Database schema ready (tables created if missing).");
console.log("No demo data inserted. Users and posts come from real signup and the app.");

await closeDb();
