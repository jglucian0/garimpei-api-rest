const affiliateService = require('../../src/services/mercado_livre/affiliateMercadoLivreService')
const scraperService = require('../../src/services/mercado_livre/extractMercadoLivreService')

class ExtractionController {
  async extractProduct(req, res) {
    try {
      const { url, userId } = req.body;

      if (!userId) {
        return res.status(400).json({ erro: 'The "userId" field is required to generate the affiliate link.' })
      };
      if (!url) {
        return res.status(400).json({ erro: 'The "url" field is required to generate the affiliate link.' })
      };

      const isMercadoLivre =
        url.includes('mercadolivre.com.br') ||
        url.includes('meli.la');

      if (!isMercadoLivre) {
        return res.status(400).json({
          error: 'Marketplace not supported. We currently only support links from Mercado Libre (including meli.la).'
        });
      };

      const productData = await scraperService.fetchProduct(url, userId);

      const affiliateLink = await affiliateService.generateAffiliateLink(productData.url, userId);

      const responsePayload = {
        imagePath: productData.imageUrl ? `![product_image](${productData.imageUrl})` : null,
        product: productData.title,
        link: affiliateLink,
        linkOriginal: productData.url,
        original_price: productData.oldPriceValue || productData.currentPriceValue,
        current_price: productData.currentPriceValue,
        discount: productData.discountPercent ? `${productData.discountPercent}% OFF` : null,
        free_shipping: !!productData.shipping,
        soldQuantity: productData.soldQuantity,
        coupon_applied: productData.couponApplied
      };

      return res.status(200).json(responsePayload);

    } catch (error) {
      console.error(`[ExtractionController] Fatal Error: ${error.message}`);

      if (error.message === 'COOKIES_NOT_FOUND') {
        return res.status(401).json({ error: 'Cookies not found or expired. Please upload them again to the /config/cookies path.' });
      }

      if (error.message === 'TAG_NOT_FOUND_IN_DB') {
        return res.status(400).json({ error: 'Missing affiliate tag. Please configure your tag along with your cookies at the /config/cookies route.' });
      }

      if (error.message === 'NO_SSID') {
        return res.status(401).json({ error: 'Invalid session (SSID missing). Please log in to Mercado Libre again and update your cookies.' });
      }

      if (error.message === 'REQUEST_FAILED' || error.message === 'INVALID_API_RESPONSE') {
        return res.status(502).json({ error: 'Failed to communicate with the Mercado Libre API. The affiliate link could not be generated.' });
      }

      return res.status(500).json({ error: 'Internal error while trying to extract product data or generate the affiliate link.' });
    }
  }
}

module.exports = new ExtractionController();