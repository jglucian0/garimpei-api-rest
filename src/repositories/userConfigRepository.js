const pool = require('../infra/db');

class UserConfigRepository {

  async saveUserCookies(userId, marketplace, cookiesArray) {
    const query = `
      INSERT INTO user_marketplace_configs (user_id, marketplace, cookies, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        cookies = EXCLUDED.cookies,
        updated_at = CURRENT_TIMESTAMP;
    `;

    const values = [userId, marketplace, JSON.stringify(cookiesArray)];

    try {
      await pool.query(query, values);
      return true;
    } catch (error) {
      console.error('[Repository] Error saving cookies:', error.message);
      throw new Error('Failed to save cookies to the database.');
    }
  }

  async getUserCookies(userId) {
    const query = `
      SELECT cookies 
      FROM user_marketplace_configs 
      WHERE user_id = $1 
      LIMIT 1;
    `;

    try {
      const result = await pool.query(query, [userId]);

      if (result.rows.length === 0) {
        return [];
      }

      return result.rows[0].cookies;
    } catch (error) {
      console.error('[Repository] Error when fetching cookies:', error.message);
      throw new Error('Failed to retrieve cookies from the database.');
    }
  }
}

module.exports = new UserConfigRepository();