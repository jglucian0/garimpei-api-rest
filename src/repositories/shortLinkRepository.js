const pool = require('../infra/db');

class ShortLinkRepository {
  async saveLink(code, originalUrl, userId) {
    const query = `INSERT INTO short_links (code, original_url, user_id) VALUES ($1, $2, $3)`;

    try {
      await pool.query(query, [code, originalUrl, userId]);
    } catch (error) {
      console.error('[Repository] Erro ao salvar short link:', error.message);
      throw new Error('Falha ao salvar o link no banco de dados.');
    }
  }

  async getOriginalUrl(code) {
    const query = `SELECT original_url FROM short_links WHERE code = $1 LIMIT 1`;

    try {
      const result = await pool.query(query, [code]);
      return result.rows.length ? result.rows[0].original_url : null;
    } catch (error) {
      console.error('[Repository] Erro ao buscar short link:', error.message);
      throw new Error('Falha ao buscar o link no banco de dados.');
    }
  }
}

module.exports = new ShortLinkRepository();