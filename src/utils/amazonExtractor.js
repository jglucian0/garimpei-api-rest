function extractAmazonProductData() {
  const parsePrice = (text) => {
    if (!text || !text.trim()) return null;
    const cleaned = text.replace(/[^0-9,]/g, '').replace(',', '.');
    const val = Number(cleaned);
    return isNaN(val) || val === 0 ? null : val;
  };

  const titleEl = document.querySelector('#productTitle');
  const imgEl = document.querySelector('#landingImage') || document.querySelector('#imgBlkFront');

  let currentPriceValue = null;
  const currentPriceWhole = document.querySelector('.priceToPay .a-price-whole');
  const currentPriceFraction = document.querySelector('.priceToPay .a-price-fraction');

  if (currentPriceWhole && currentPriceFraction) {
    const whole = currentPriceWhole.textContent.replace(/\D/g, '');
    const fraction = currentPriceFraction.textContent.replace(/\D/g, '');
    currentPriceValue = Number(`${whole}.${fraction}`);
  } else {
    const currentPriceEl = document.querySelector('.priceToPay span[aria-hidden="true"]') || document.querySelector('.priceToPay');
    currentPriceValue = parsePrice(currentPriceEl ? currentPriceEl.textContent : null);
  }

  const oldPriceEl = document.querySelector('.basisPrice .a-offscreen') || document.querySelector('.a-text-price[data-a-strike="true"] span[aria-hidden="true"]');
  const oldPriceValue = parsePrice(oldPriceEl ? oldPriceEl.textContent : null);

  let discountPercent = null;
  const discountBadge = document.querySelector('.savingsPercentage');
  const pixDiscount = document.querySelector('#oneTimePaymentPrice_feature_div');

  if (discountBadge) {
    const match = discountBadge.textContent.match(/\d+/);
    if (match) discountPercent = Number(match[0]);
  } else if (pixDiscount && pixDiscount.textContent.toLowerCase().includes('off')) {
    const match = pixDiscount.textContent.match(/(\d+)%\s*off/i);
    if (match) discountPercent = Number(match[1]);
  }

  if (!discountPercent && oldPriceValue && currentPriceValue && oldPriceValue > currentPriceValue) {
    discountPercent = Math.round(((oldPriceValue - currentPriceValue) / oldPriceValue) * 100);
  }

  let freeShipping = false;
  const deliveryBlock = document.querySelector('#deliveryBlock_feature_div') || document.querySelector('#deliveryBlockMessage');
  if (deliveryBlock) {
    const deliveryText = deliveryBlock.textContent.toLowerCase();
    if (deliveryText.includes('grátis') || deliveryText.includes('gratis') || deliveryText.includes('free')) {
      freeShipping = true;
    }
  }

  let soldQuantity = null;
  const soldEl = document.querySelector('#social-proofing-faceout-title-tk_bought') || document.querySelector('.social-proofing-faceout-title-text');
  if (soldEl) {
    let text = soldEl.textContent.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
    text = text.replace(/Mais de/i, '+');
    soldQuantity = text;
  }

  return {
    title: titleEl ? titleEl.textContent.trim() : 'Title not found',
    currentPriceValue: currentPriceValue,
    oldPriceValue: oldPriceValue,
    discountPercent: discountPercent,
    imageUrl: imgEl ? imgEl.getAttribute('src') : null,
    shipping: freeShipping,
    soldQuantity: soldQuantity,
    couponApplied: false
  };
}

module.exports = extractAmazonProductData;