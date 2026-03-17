const affiliateMLService = require('../services/mercado_livre/affiliateMercadoLivreService');
const scraperMLService = require('../services/mercado_livre/extractMercadoLivreService');
const affiliateAmzService = require('../services/amazon/affiliateAmazonService');
const scraperAmzService = require('../services/amazon/extractAmazonService');

class ExtractionController {
  async extractProduct(req, res) {
    try {
      const { url, userId } = req.body;

      if (!userId) return res.status(400).json({ erro: 'The "userId" field is required.' });
      if (!url) return res.status(400).json({ erro: 'The "url" field is required.' });

      let marketplace = null;
      if (url.includes('mercadolivre.com') || url.includes('meli.la')) {
        marketplace = 'ML';
      } else if (url.includes('amazon.com.br') || url.includes('amzn.to') || url.includes('a.co')) {
        marketplace = 'AMAZON';
      }

      if (!marketplace) {
        return res.status(400).json({ error: 'Marketplace not supported.' });
      }

      let productData;
      let affiliateLink;

      if (marketplace === 'ML') {
        productData = await scraperMLService.fetchProduct(url, userId);
        affiliateLink = await affiliateMLService.generateAffiliateLink(productData.url, userId);
      }
      else if (marketplace === 'AMAZON') {
        productData = await scraperAmzService.fetchProduct(url);
        affiliateLink = await affiliateAmzService.generateAffiliateLink(productData.asin, userId);
      }

      const responsePayload = {
        marketplace: marketplace,
        imagePath: productData.imageUrl ? `![product_image](${productData.imageUrl})` : null,
        product: productData.title,
        link: affiliateLink,
        linkOriginal: productData.url,
        original_price: productData.oldPriceValue || productData.currentPriceValue,
        current_price: productData.currentPriceValue,
        discount: productData.discountPercent ? `${productData.discountPercent}% OFF` : null,
        free_shipping: !!productData.shipping,
        soldQuantity: productData.soldQuantity || null,
        coupon_applied: productData.couponApplied || false
      };

      return res.status(200).json(responsePayload);

    } catch (error) {
      console.error(`[ExtractionController] Fatal Error: ${error.message}`);

      if (error.message === 'COOKIES_NOT_FOUND') return res.status(401).json({ error: 'Cookies not found.' });
      if (error.message === 'TAG_NOT_FOUND_IN_DB') return res.status(400).json({ error: 'Missing affiliate tag.' });
      if (error.message === 'NO_SSID') return res.status(401).json({ error: 'Invalid session (SSID missing). Please log in again.' });
      if (error.message === 'REQUEST_FAILED' || error.message === 'INVALID_API_RESPONSE') return res.status(502).json({ error: 'Failed to communicate with the Marketplace API.' });

      return res.status(500).json({ error: 'Internal error while trying to extract product data.' });
    }
  }
}

module.exports = new ExtractionController();