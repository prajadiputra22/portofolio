// Cara pakai:
// node generate-hash.js username_kamu password_kamu
//
// Script ini akan print statement SQL INSERT yang siap dijalankan
// di Supabase SQL Editor.

const bcrypt = require("bcryptjs");

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error("Cara pakai: node generate-hash.js <username> <password>");
  process.exit(1);
}

const SALT_ROUNDS = 12;
const hashed = bcrypt.hashSync(password, SALT_ROUNDS);

console.log("\nHash bcrypt kamu:");
console.log(hashed);

console.log("\nSQL siap pakai (copy-paste ke Supabase SQL Editor):\n");
console.log(
  `insert into public.users (username, password) values ('${username}', '${hashed}');`
);