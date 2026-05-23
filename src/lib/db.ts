import { Pool } from 'pg';

// Create a single pool instance to be reused across the application
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
