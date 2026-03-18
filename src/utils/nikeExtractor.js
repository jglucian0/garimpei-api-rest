function extractNikeProductData() {
  const parsePrice = (text) => {
    if (!text || typeof text !== 'string') return null;

    // O &nbsp; (espaço não quebrável) às vezes vira um caractere estranho no scraping, 
    // o regex \s* lida com ele e com espaços comuns.
    const match = text.match(/R\$\s*([\d.,]+)/);
    if (!match) return null;

    // Remove pontos de milhar e troca vírgula por ponto decimal
    const cleaned = match[1].replace(/\./g, '').replace(',', '.');
    const val = parseFloat(cleaned);
    return isNaN(val) || val === 0 ? null : val;
  };

  // 1. Título (Usando o data-testid que você passou)
  const titleEl = document.querySelector('[data-testid="product-name"]');
  const titleMeta = document.querySelector('meta[property="og:title"]');
  let title = titleEl ? titleEl.textContent.trim() : (titleMeta ? titleMeta.content : 'Título não encontrado');

  // Limpeza: Remove o sufixo da Nike Brasil
  title = title.replace(/\s*-\s*Nike\s*Brasil/i, '').trim();

  // 2. Imagem
  const imgMeta = document.querySelector('meta[property="og:image"]');
  const imgEl = document.querySelector('img[data-testid="product-image"], .product-image img');
  const imageUrl = imgEl ? (imgEl.getAttribute('src') || imgEl.src) : (imgMeta ? imgMeta.content : null);

  // 3. Preços (Seletores cirúrgicos)
  const currentPriceEl = document.querySelector('[data-testid="main-price"]');
  const oldPriceEl = document.querySelector('[data-testid="old-price"]');

  let currentPriceValue = currentPriceEl ? parsePrice(currentPriceEl.textContent) : null;
  let oldPriceValue = oldPriceEl ? parsePrice(oldPriceEl.textContent) : null;

  // Trava de segurança para preços idênticos ou erro de site
  if (oldPriceValue !== null && currentPriceValue !== null) {
    if (oldPriceValue <= currentPriceValue) {
      oldPriceValue = null;
    }
  }

  // 4. Desconto
  let discountPercent = null;
  const discountEl = document.querySelector('[data-testid="discount-percentage"]');

  if (discountEl && oldPriceValue) {
    // Extrai o número do texto "15% off"
    const match = discountEl.textContent.match(/\d+/);
    if (match) discountPercent = parseInt(match[0], 10);
  } else if (oldPriceValue && currentPriceValue && oldPriceValue > currentPriceValue) {
    // Cálculo manual se a tag de desconto não existir no HTML
    discountPercent = Math.round(((oldPriceValue - currentPriceValue) / oldPriceValue) * 100);
  }

  return {
    title: title,
    currentPriceValue: currentPriceValue,
    oldPriceValue: oldPriceValue,
    discountPercent: discountPercent,
    imageUrl: imageUrl,
    shipping: false, // Nike dificilmente dá frete grátis, conforme solicitado
    soldQuantity: null,
    couponApplied: null
  };
}

module.exports = extractNikeProductData;