function extractCentauroProductData() {
  const parsePrice = (text) => {
    if (!text || typeof text !== 'string') return null;
    const match = text.match(/R\$\s*([\d.,]+)/);
    if (!match) return null;

    const cleaned = match[1].replace(/\./g, '').replace(',', '.');
    const val = Number(cleaned);
    return isNaN(val) || val === 0 ? null : val;
  };

  const titleEl = document.querySelector('[data-testid="product-title"]');
  const titleMeta = document.querySelector('meta[property="og:title"]');
  let title = titleEl ? titleEl.textContent.trim() : (titleMeta ? titleMeta.content : 'Title not found');
  title = title.replace(/\s*\|\s*Centauro/i, '').trim();

  const imgEl = document.querySelector('[data-testid="product-image"] img, .product-image img');
  const imgMeta = document.querySelector('meta[property="og:image"]');
  const imageUrl = imgEl ? imgEl.getAttribute('src') : (imgMeta ? imgMeta.content : null);

  const currentPriceEl = document.querySelector('[data-testid="price-current"]');
  const currentPriceValue = currentPriceEl ? parsePrice(currentPriceEl.textContent) : null;

  const oldPriceEl = document.querySelector('[data-testid="price-promotion"] del');
  const oldPriceValue = oldPriceEl ? parsePrice(oldPriceEl.textContent) : null;

  if (oldPriceValue === currentPriceValue) {
    oldPriceValue = null;
  }

  let discountPercent = null;
  const discountEl = document.querySelector('[data-testid="price-discount"]');

  if (discountEl) {
    const match = discountEl.textContent.match(/\d+/);
    if (match) discountPercent = Number(match[0]);
  } else if (oldPriceValue && currentPriceValue && oldPriceValue > currentPriceValue) {
    discountPercent = Math.round(((oldPriceValue - currentPriceValue) / oldPriceValue) * 100);
  }

  return {
    title: title,
    currentPriceValue: currentPriceValue,
    oldPriceValue: oldPriceValue,
    discountPercent: discountPercent,
    imageUrl: imageUrl,
    shipping: true,
    soldQuantity: null,
    couponApplied: null
  };
}

module.exports = extractCentauroProductData;