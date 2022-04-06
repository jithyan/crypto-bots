import { writeFileSync } from "fs";
import mariadb from "mariadb";
import { getAllCsvData } from "./csv.js";
import { createTradeTable } from "./db_scripts/createTradeTable.js";

console.log("WORK IN PROGRESS");

const pool = mariadb.createPool({
  user: "admin",
  password: "password",
  connectionLimit: 5,
  database: "trades_db",
});

console.log("Created pool");

async function asyncFunction() {
  let conn;
  try {
    console.log("Get conenction");

    conn = await pool.getConnection();
    // const res = await conn.query("create database trades_db");
    console.log("Execute create", conn);

    const rows = await conn.query(createTradeTable);
    // console.log("Create executed", rows);

    const row4 = await conn.query("SELECT * FROM trades;");
    // console.log("rows", rows);
    console.log("row", row4);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
}
console.log(getAllCsvData());
const stmt = getAllCsvData();
writeFileSync("./stmt.txt", stmt, "utf8");
// asyncFunction();
