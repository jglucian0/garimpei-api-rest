function extractProductData() {
  const getTitle = () => {
    const el = document.querySelector('.ui-pdp-title') || document.querySelector('h1');
    return el ? el.innerText.trim() : "Title not found";
  };

  const extractCurrentPriceSemantic = () => {
    const container = document.querySelector('#price .ui-pdp-price__second-line');
    if (!container) return null;

    const meta = container.querySelector('meta[itemprop="price"]');
    if (meta?.content) {
      const value = Number(meta.content);
      const [reais, cents = '00'] = meta.content.split('.');
      return { raw: meta.content, value, reais, cents };
    }

    const part = container.querySelector('[data-testid="price-part"]');
    if (!part) return null;

    let reais = part.querySelector('.andes-money-amount__fraction')?.textContent;
    let cents = part.querySelector('.andes-money-amount__cents')?.textContent;

    if (!reais) return null;

    return {
      raw: `${reais}.${cents || '00'}`,
      value: Number(`${reais}.${cents || '00'}`),
      reais,
      cents: cents || '00'
    };
  };

  const extractOldPriceSemantic = (currentPriceValue) => {

    const moneyElements = Array.from(
      document.querySelectorAll('#price .andes-money-amount')
    );

    if (!moneyElements.length) return null;

    const prices = moneyElements.map(el => {

      let reais = el.querySelector('.andes-money-amount__fraction')?.textContent;
      let cents = el.querySelector('.andes-money-amount__cents')?.textContent || '00';

      if (!reais) return null;

      const value = Number(`${reais}.${cents}`);

      const isStriked =
        el.closest('s') ||
        el.closest('.ui-pdp-price__original-value') ||
        el.getAttribute('aria-label')?.toLowerCase().includes('antes');

      return {
        value,
        reais,
        cents,
        isStriked: !!isStriked
      };

    }).filter(Boolean);

    if (!prices.length) return null;

    let oldPrice =
      prices
        .filter(p => p.isStriked && (!currentPriceValue || p.value > currentPriceValue))
        .sort((a, b) => b.value - a.value)[0]
      ||
      prices
        .filter(p => currentPriceValue && p.value > currentPriceValue)
        .sort((a, b) => b.value - a.value)[0];

    if (!oldPrice) return null;

    return {
      raw: `${oldPrice.reais}.${oldPrice.cents || '00'}`,
      value: Number(`${oldPrice.reais}.${oldPrice.cents || '00'}`),
      reais: oldPrice.reais,
      cents: oldPrice.cents || '00',
      isStriked: oldPrice.isStriked
    };
  };

  const extractShippingInfo = () => {

    const normalize = txt =>
      txt?.replace(/\s+/g, ' ').trim().toLowerCase();

    const isValidShippingText = (text) => {
      if (!text) return false;

      const t = normalize(text);

      return (
        t.includes('frete grátis') ||
        t.includes('chegará grátis') ||
        t.includes('frete gratis') ||
        t.includes('grátis') ||
        t.includes('gratis') ||
        t.includes('chega amanhã') ||
        t.includes('full')
      );
    };

    const shippingSummary = document.querySelector('#shipping_summary');
    if (shippingSummary) {
      const greenText = shippingSummary.querySelector('.ui-pdp-color--GREEN');
      if (greenText) {
        const text = greenText.innerText;
        if (isValidShippingText(text)) return text.trim();
      }

      const fullText = shippingSummary.innerText;
      if (isValidShippingText(fullText)) return fullText.trim();
    }

    const special = document.getElementById('special_event_shipping_summaryspecial_event_shipping_summary');
    if (special) {
      const text = special.innerText;
      if (isValidShippingText(text)) return text.trim();
    }

    const pills = Array.from(
      document.querySelectorAll('.ui-pdp-promotions-pill-label')
    );

    for (const el of pills) {
      const text = el.innerText;
      if (isValidShippingText(text)) return text.trim();
    }

    const priceSection = document.querySelector('#price')?.innerText;
    if (isValidShippingText(priceSection)) {
      const match = priceSection.match(/(frete[^.\n]+)/i);
      if (match) return match[1].trim();
    }

    return null;
  };

  const extractPrimaryImage = () => {

    const isValidImage = (url) => {
      if (!url) return false;

      const u = url.toLowerCase();

      if (u.includes('sprite')) return false;
      if (u.includes('gif')) return false;
      if (u.includes('loading')) return false;
      if (u.includes('video')) return false;

      return (
        u.includes('.jpg') ||
        u.includes('.jpeg') ||
        u.includes('.png') ||
        u.includes('.webp')
      );
    };

    const figures = Array.from(
      document.querySelectorAll('.ui-pdp-gallery__figure')
    );

    for (const figure of figures) {

      if (figure.querySelector('.clip-wrapper')) continue;

      const zoomImg = figure.querySelector('img[data-zoom]');
      if (zoomImg) {
        const zoomUrl = zoomImg.getAttribute('data-zoom');
        if (isValidImage(zoomUrl)) return zoomUrl;
      }

      const img = figure.querySelector('img');
      if (img) {
        const src = img.getAttribute('src');
        if (isValidImage(src)) return src;
      }
    }

    return null;
  };

  const extractSoldQuantity = () => {

    const subtitleContainer = document.querySelector('.ui-pdp-header__subtitle');
    if (!subtitleContainer) return null;

    const span = subtitleContainer.querySelector('.ui-pdp-subtitle');
    if (!span) return null;

    const aria = span.getAttribute('aria-label') || span.textContent;
    if (!aria) return null;

    const match = aria.match(/(\+?\s*[\d\.]+\s*(mil|k|M|milhão|milhões)?\s*vendidos)/i);

    if (!match) return null;

    let text = match[1]
      .replace(/Mais de\s*/i, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!text.startsWith('+')) text = '+' + text;

    text = text
      .replace(/(\d)(mil)/i, '$1 mil')
      .replace(/(\d+)\s*k\b/i, '$1 mil')
      .replace(/(\d+)\s*M\b/i, (_, num) => {
        return Number(num) === 1
          ? `${num} milhão`
          : `${num} milhões`;
      });

    return text;
  };

  const extractCoupon = () => {

    const label =
      document.getElementById('coupon-awareness-row-label') ||
      document.querySelector('#coupon_summary-main-title') ||
      document.querySelector('[data-testid="coupon-label"]');


    if (!label) return null;

    let text = label.innerText || label.textContent;
    if (!text) return null;

    text = text.replace(/\s+/g, ' ').trim().toLowerCase();

    let percentMatch = text.match(/(\d{1,3})\s*%/);
    if (percentMatch) {
      return {
        type: 'percent',
        value: Number(percentMatch[1]),
        raw: text
      };
    }

    let moneyMatch = text.match(/r\$\s*(\d+[.,]?\d*)/);
    if (moneyMatch && text.includes('off')) {
      return {
        type: 'money',
        value: Number(moneyMatch[1].replace(',', '.')),
        raw: text
      };
    }

    return null;
  };

  const extractCouponMinimumPurchase = () => {

    const minNode = document.getElementById('coupon_summary-subtitles-style-label');

    if (minNode) {

      const fraction = minNode.querySelector('.andes-money-amount__fraction')?.textContent;
      const cents = minNode.querySelector('.andes-money-amount__cents')?.textContent || '00';

      if (fraction) {
        return Number(`${fraction}.${cents}`);
      }

      const aria = minNode.innerText || minNode.textContent;
      const match = aria?.match(/(\d+[.,]?\d*)\s*reais/i);
      if (match) return Number(match[1].replace(',', '.'));
    }

    const label = document.getElementById('coupon-awareness-row-label');

    if (label) {
      const text = label.innerText || label.textContent;

      let match = text?.match(/(acima|superior)\s+(de|a)\s+r?\$\s*(\d+[.,]?\d*)/i);
      if (match) return Number(match[3].replace(',', '.'));

      match = text?.match(/(\d+[.,]?\d*)\s*reais/i);
      if (match) return Number(match[1].replace(',', '.'));
    }

    return null;
  };

  const applyCouponDiscount = (currentPrice, coupon) => {
    if (!currentPrice?.value || !coupon) return currentPrice;

    let newValue = currentPrice.value;

    if (coupon.type === 'percent') {
      newValue = currentPrice.value * (1 - coupon.value / 100);
    }

    if (coupon.type === 'money') {
      newValue = currentPrice.value - coupon.value;
    }

    if (newValue <= 0) return currentPrice;

    newValue = Number(newValue.toFixed(2));

    const [reais, cents = '00'] = newValue.toFixed(2).split('.');

    return {
      ...currentPrice,
      value: newValue,
      reais,
      cents,
      raw: `${reais}.${cents}`
    };
  };

  let currentPrice = extractCurrentPriceSemantic();
  const oldPrice = extractOldPriceSemantic(currentPrice?.value);
  const shipping = extractShippingInfo();
  const imageUrl = extractPrimaryImage();
  const soldQuantity = extractSoldQuantity();
  const coupon = extractCoupon();
  const couponMinimum = extractCouponMinimumPurchase();

  let appliedCoupon = false;
  if (coupon && currentPrice?.value) {

    if (!couponMinimum || currentPrice.value >= couponMinimum) {
      currentPrice = applyCouponDiscount(currentPrice, coupon);
      appliedCoupon = true;
    }

  }

  let discountPercent = null;
  if (oldPrice?.value && currentPrice?.value) {
    discountPercent = Math.round(
      ((oldPrice.value - currentPrice.value) / oldPrice.value) * 100
    );
  }

  return {
    title: getTitle(),
    priceText: currentPrice?.raw || null,

    currentPriceText: currentPrice?.raw || null,
    currentPriceValue: currentPrice?.value || null,
    currentPriceReais: currentPrice?.reais || null,
    currentPriceCents: currentPrice?.cents || null,

    oldPriceText: oldPrice?.raw || null,
    oldPriceValue: oldPrice?.value || null,
    oldPriceReais: oldPrice?.reais || null,
    oldPriceCents: oldPrice?.cents || null,

    discountPercent,
    shipping,
    soldQuantity,
    coupon: coupon,
    couponMinimum,
    couponApplied: appliedCoupon,
    imageUrl,

    url: window.location.href
  };
}

module.exports = extractProductData;