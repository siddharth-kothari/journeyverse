import mysql from "mysql2/promise";

export async function query({ query, data }: any) {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [results]: any = await db.execute(query, data);
    db.end();
    if (results.length === 0) {
      // Handle the case where no rows are found
      return []; // Or return a specific structure indicating no rows were found
    } else {
      return results;
    }
  } catch (error: any) {
    throw Error(error.message);
  }
}
