import { Pool } from "https://deno.land/x/postgres@v0.11.2/mod.ts";

const pool = new Pool(
  {
    database: "postgres",
    hostname: "postgres",
    user: "postgres",
    password: "admin",
    port: 2432,
  },
  20,
  true
);

// deno-lint-ignore ban-types
export async function runQuery<T extends {}>(
  query: string,
  // deno-lint-ignore no-explicit-any
  params?: any[]
): Promise<T[]> {
  const client = await pool.connect();

  const dbResult = await client.queryObject<T>({
    text: query,
    args: params,
  });

  client.release();

  return dbResult.rows;
}

await runQuery(`DROP TABLE IF EXISTS Users`);

await runQuery(`
    CREATE TABLE Users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        country VARCHAR(2)
    );
`);

await runQuery(`INSERT INTO Users(name, country) VALUES ('Lumap', 'fr')`);
await runQuery(`INSERT INTO Users(name, country) VALUES ('link', 'de')`);

const data = await runQuery<User>("SELECT * from Users");
console.log(data);

interface User {
  id: number;
  name: string;
  country: string;
}
