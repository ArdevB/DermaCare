// One-off maintenance script: lists indexes on the `users` collection and
// drops any leftover unique index on a field that's no longer part of the
// User schema (e.g. a stale "phone_1" index from an earlier schema version).
//
// Usage:
//   node scripts/fixUserIndexes.js
//
// Safe to run multiple times - it only drops indexes that exist and skips
// the default _id index.

import mongoose from "mongoose";
import config from "../config/config.js";

const run = async () => {
  await mongoose.connect(config.mongodbUri);
  console.log(`Connected to ${mongoose.connection.name}`);

  const collection = mongoose.connection.collection("users");
  const indexes = await collection.indexes();

  console.log("\nCurrent indexes on `users`:");
  indexes.forEach((idx) => console.log(`  - ${idx.name}:`, JSON.stringify(idx.key)));

  // Fields the current User schema actually defines indexes for.
  const currentSchemaFields = new Set(["_id_", "email_1"]);

  const staleIndexes = indexes.filter((idx) => !currentSchemaFields.has(idx.name));

  if (staleIndexes.length === 0) {
    console.log("\nNo stale indexes found. Nothing to do.");
  } else {
    console.log("\nDropping stale indexes not present in the current schema:");
    for (const idx of staleIndexes) {
      await collection.dropIndex(idx.name);
      console.log(`  Dropped: ${idx.name}`);
    }
  }

  await mongoose.disconnect();
  console.log("\nDone.");
  process.exit(0);
};

run().catch((err) => {
  console.error("Failed to fix indexes:", err.message);
  process.exit(1);
});
