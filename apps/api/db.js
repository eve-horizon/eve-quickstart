import pg from 'pg';

const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://app:app@localhost:5432/eve_starter';

const ssl = DATABASE_URL.includes('sslmode=')
  ? { rejectUnauthorized: false }
  : false;

const pool = new pg.Pool({ connectionString: DATABASE_URL, ssl });

const query = (text, params) => pool.query(text, params);

const close = () => pool.end();

export { pool, query, close };
