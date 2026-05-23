const { Client } = require('pg');

const { Redis } = require('@upstash/redis');

async function test() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log("Connected to Neon DB");
    const seqResult = await client.query("SELECT nextval('links_id_seq') AS id");
    console.log("Nextval:", seqResult.rows[0].id);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    await redis.set('test', 'test-value');
    console.log("Redis connected and set successfully");
  } catch(err) {
    console.error("Redis Error:", err);
  }
}
test();
