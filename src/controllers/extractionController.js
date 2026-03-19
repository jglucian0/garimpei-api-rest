const urlResolutionService = require('../services/urlResolutionService');

const affiliateMLService = require('../services/mercado_livre/affiliateMercadoLivreService');
const scraperMLService = require('../services/mercado_livre/extractMercadoLivreService');

const affiliateAmzService = require('../services/amazon/affiliateAmazonService');
const scraperAmzService = require('../services/amazon/extractAmazonService');

const affiliateCentauroService = require('../services/centauro/affiliateCentauroService');
const scraperCentauroService = require('../services/centauro/extractCentauroService');

const affiliateNikeService = require('../services/nike/affiliateNikeService');
const scraperNikeService = require('../services/nike/extractNikeService');

class ExtractionController {
  async extractProduct(req, res) {
    try {
      const { url, userId } = req.body;

      if (!userId) return res.status(400).json({ erro: 'The "userId" field is required.' });
      if (!url) return res.status(400).json({ erro: 'The "url" field is required.' });

      let resolvedUrl = url;

      const isDirectLink =
        url.includes('centauro.com.br') ||
        url.includes('nike.com.br') ||
        url.includes('mercadolivre.com.br') ||
        url.includes('amazon.com.br/dp/');

      if (!isDirectLink) {
        resolvedUrl = await urlResolutionService.resolveFinalUrl(url);
      }

      let marketplace = null;
      if (resolvedUrl.includes('mercadolivre.com') || resolvedUrl.includes('meli.la')) {
        marketplace = 'ML';
      } else if (
        resolvedUrl.includes('amazon.com.br') ||
        resolvedUrl.includes('amzn.to') ||
        resolvedUrl.includes('a.co')
      ) {
        marketplace = 'AMAZON';
      } else if (resolvedUrl.includes('centauro.com.br')) {
        marketplace = 'CENTAURO';
      } else if (resolvedUrl.includes('nike.com.br')) {
        marketplace = 'NIKE';
      }

      if (!marketplace) {
        return res.status(400).json({ error: 'Marketplace not supported or invalid URL.' });
      }

      let productData;
      let affiliateLink;

      if (marketplace === 'ML') {
        productData = await scraperMLService.fetchProduct(resolvedUrl, userId);
        affiliateLink = await affiliateMLService.generateAffiliateLink(productData.url, userId);
      } else if (marketplace === 'AMAZON') {
        productData = await scraperAmzService.fetchProduct(resolvedUrl);
        affiliateLink = await affiliateAmzService.generateAffiliateLink(productData.asin, userId);
      } else if (marketplace === 'CENTAURO') {
        productData = await scraperCentauroService.fetchProduct(resolvedUrl);
        affiliateLink = await affiliateCentauroService.generateAffiliateLink(
          productData.url,
          userId
        );
      } else if (marketplace === 'NIKE') {
        productData = await scraperNikeService.fetchProduct(resolvedUrl);
        affiliateLink = await affiliateNikeService.generateAffiliateLink(productData.url, userId);
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

      if (error.message === 'ML_COOKIES_NOT_FOUND')
        return res.status(401).json({ error: 'Mercado Livre cookies not found or expired.' });
      if (error.message === 'ML_TAG_NOT_FOUND')
        return res.status(401).json({ error: 'Mercado Livre tag not configured.' });
      if (error.message === 'AMAZON_TAG_NOT_FOUND')
        return res.status(401).json({ error: 'Amazon configuration not found for this user.' });
      if (error.message === 'AWIN_TAG_NOT_FOUND')
        return res.status(401).json({ error: 'Awin ID (awinaffid) not configured for this user.' });
      if (error.message === 'TAG_NOT_FOUND_IN_DB')
        return res.status(400).json({ error: 'Missing affiliate tag.' });
      if (error.message === 'NO_SSID')
        return res
          .status(401)
          .json({ error: 'Invalid session (SSID missing). Please log in again.' });
      if (error.message === 'REQUEST_FAILED' || error.message === 'INVALID_API_RESPONSE')
        return res.status(502).json({ error: 'Failed to communicate with the Marketplace API.' });

      return res
        .status(500)
        .json({ error: 'Internal error while trying to extract product data.' });
    }
  }
}

module.exports = new ExtractionController();
