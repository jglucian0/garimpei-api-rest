const pool = require('../infra/db');

class UserConfigRepository {

  async saveUserConfigs(userId, marketplace, cookiesArray, tag) {
    const query = `
      INSERT INTO user_marketplace_configs (user_id, marketplace, cookies, tag, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        cookies = EXCLUDED.cookies,
        tag = EXCLUDED.tag,
        updated_at = CURRENT_TIMESTAMP;
    `;

    const values = [userId, marketplace, JSON.stringify(cookiesArray), tag];

    try {
      await pool.query(query, values);
      return true;
    } catch (error) {
      console.error('[Repository] Error saving configs:', error.message);
      throw new Error('Failed to save configurations to the database.');
    }
  }

  async getUserConfigs(userId) {
    const query = `
      SELECT cookies, tag 
      FROM user_marketplace_configs 
      WHERE user_id = $1 
      LIMIT 1;
    `;

    try {
      const result = await pool.query(query, [userId]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('[Repository] Error when fetching configs:', error.message);
      throw new Error('Failed to retrieve configurations from the database.');
    }
  }
}

module.exports = new UserConfigRepository();