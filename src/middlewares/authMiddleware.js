const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const secret = process.env.INTERNAL_API_KEY;

  if (!apiKey || apiKey !== secret) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access Denied: Invalid or missing API key.'
    });
  }

  next();
};

module.exports = authMiddleware;