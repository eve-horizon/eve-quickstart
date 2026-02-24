import pg from 'pg';

const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://app:app@localhost:5432/eve_starter';

const pool = new pg.Pool({ connectionString: DATABASE_URL });

const query = (text, params) => pool.query(text, params);

const close = () => pool.end();

export { pool, query, close };
