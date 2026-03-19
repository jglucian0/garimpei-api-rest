const pool = require('../infra/db');

class ShortLinkRepository {
  async getExistingCode(originalUrl, userId) {
    const query = `SELECT code FROM short_links WHERE original_url = $1 AND user_id = $2 LIMIT 1`;

    try {
      const result = await pool.query(query, [originalUrl, userId]);
      return result.rows.length ? result.rows[0].code : null;
    } catch (error) {
      console.error('[Repository] Error checking existing link:', error.message);
      throw new Error('Failed to check existing link in database.', { cause: error });
    }
  }

  async saveLink(code, originalUrl, userId) {
    const query = `INSERT INTO short_links (code, original_url, user_id) VALUES ($1, $2, $3)`;

    try {
      await pool.query(query, [code, originalUrl, userId]);
    } catch (error) {
      console.error('[Repository] Error saving short link:', error.message);
      throw new Error('Failed to save link to database.', { cause: error });
    }
  }

  async getOriginalUrl(code) {
    const query = `SELECT original_url FROM short_links WHERE code = $1 LIMIT 1`;

    try {
      const result = await pool.query(query, [code]);
      return result.rows.length ? result.rows[0].original_url : null;
    } catch (error) {
      console.error('[Repository] Error when fetching short link:', error.message);
      throw new Error('Failed to fetch the link from the database.', { cause: error });
    }
  }
}

module.exports = new ShortLinkRepository();