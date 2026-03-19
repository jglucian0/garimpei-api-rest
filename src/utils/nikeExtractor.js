function extractNikeProductData() {
  const parsePrice = (text) => {
    if (!text || typeof text !== 'string') return null;

    const match = text.match(/R\$\s*([\d.,]+)/);
    if (!match) return null;

    const cleaned = match[1].replace(/\./g, '').replace(',', '.');
    const val = parseFloat(cleaned);
    return isNaN(val) || val === 0 ? null : val;
  };

  const titleEl = document.querySelector('[data-testid="product-name"]');
  const titleMeta = document.querySelector('meta[property="og:title"]');
  let title = titleEl ? titleEl.textContent.trim() : (titleMeta ? titleMeta.content : 'Title not found');

  title = title.replace(/\s*-\s*Nike\s*Brasil/i, '').trim();

  const imgMeta = document.querySelector('meta[property="og:image"]');
  const imgEl = document.querySelector('img[data-testid="product-image"], .product-image img');
  const imageUrl = imgEl ? (imgEl.getAttribute('src') || imgEl.src) : (imgMeta ? imgMeta.content : null);

  const currentPriceEl = document.querySelector('[data-testid="main-price"]');
  const oldPriceEl = document.querySelector('[data-testid="old-price"]');

  let currentPriceValue = currentPriceEl ? parsePrice(currentPriceEl.textContent) : null;
  let oldPriceValue = oldPriceEl ? parsePrice(oldPriceEl.textContent) : null;

  if (oldPriceValue !== null && currentPriceValue !== null) {
    if (oldPriceValue <= currentPriceValue) {
      oldPriceValue = null;
    }
  }

  let discountPercent = null;
  const discountEl = document.querySelector('[data-testid="discount-percentage"]');

  if (discountEl && oldPriceValue) {
    const match = discountEl.textContent.match(/\d+/);
    if (match) discountPercent = parseInt(match[0], 10);
  } else if (oldPriceValue && currentPriceValue && oldPriceValue > currentPriceValue) {
    discountPercent = Math.round(((oldPriceValue - currentPriceValue) / oldPriceValue) * 100);
  }

  return {
    title: title,
    currentPriceValue: currentPriceValue,
    oldPriceValue: oldPriceValue,
    discountPercent: discountPercent,
    imageUrl: imageUrl,
    shipping: false,
    soldQuantity: null,
    couponApplied: null
  };
}

module.exports = extractNikeProductData;