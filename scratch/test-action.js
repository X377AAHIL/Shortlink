const { Client } = require('pg');
const { Redis } = require('@upstash/redis');

const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = BigInt(62);

function encodeBase62(num) {
  let value = BigInt(num);
  if (value === BigInt(0)) return BASE62_ALPHABET[0];
  let encoded = '';
  while (value > BigInt(0)) {
    const remainder = Number(value % BASE);
    encoded = BASE62_ALPHABET[remainder] + encoded;
    value = value / BASE;
  }
  return encoded;
}

async function createLink(originalUrl) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
    await client.connect();
    const seqResult = await client.query("SELECT nextval('links_id_seq') AS id");
    const id = seqResult.rows[0].id;
    const shortCode = encodeBase62(id);

    await client.query(
      'INSERT INTO links (id, original_url, short_code) VALUES ($1, $2, $3)',
      [id, originalUrl, shortCode]
    );
    await redis.set(shortCode, originalUrl);
    
    return { success: true, shortCode };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: error.message };
  } finally {
    await client.end();
  }
}

createLink("https://github.com/team-repo/python-nltk-plagiarism-detector/tree/main/presentation-assets").then(console.log);
