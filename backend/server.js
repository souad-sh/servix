import "dotenv/config";
import app from "./src/app.js";
import { pool } from "./src/db/pool.js ";

const port = Number(process.env.PORT || 5000);

async function start() {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok"); // DB ping
    console.log("MySQL connected:", rows[0]);

    app.listen(port, () => {
      console.log(`API listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}
start();
