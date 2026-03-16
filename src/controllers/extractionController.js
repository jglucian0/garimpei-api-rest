const affiliateService = require('../../src/services/mercado_livre/affiliateMercadoLivreService')
const scraperService = require('../../src/services/mercado_livre/extractMercadoLivreService')

class ExtractionController {
  async extractProduct(req, res) {
    try {
      const { url, userId, tag } = req.body;

      if (!userId) {
        return res.status(400).json({ erro: 'The "userId" field is required to generate the affiliate link.' })
      };
      if (!url) {
        return res.status(400).json({ erro: 'The "url" field is required to generate the affiliate link.' })
      };
      if (!tag) {
        return res.status(400).json({ erro: 'The "tag" field is required to generate the affiliate link.' })
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

      let affiliateLink = null;

      try {
        affiliateLink = await affiliateService.generateAffiliateLink(productData.url, userId, tag);
      } catch (affiliateError) {
        console.warn(`[API Warning] Failed to generate affiliate link:: ${affiliateError.message}`);
      }

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

      return res.status(500).json({ error: 'Internal error while trying to extract product data.' });
    }
  }
}

module.exports = new ExtractionController();