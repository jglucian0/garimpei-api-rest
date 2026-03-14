const urlResolutionService = require('../../src/services/urlResolutionService');

describe('UrlResolutionService Isolated Test', () => {

  test('Deve retornar a mesma URL limpa para links diretos', async () => {
    const url = 'https://www.mercadolivre.com.br/multivitaminico-120-caps-growth-supplements-sabor-neutro-nova-formula/p/MLB21555776#reco_item_pos=4&reco_backend=item_decorator&reco_backend_type=function&reco_client=home_items-decorator-legacy&reco_id=93ce32cb-5723-4053-935f-b2d8b28d355b&reco_model=&c_id=/home/navigation-recommendations-seed/element&c_uid=5f5c55cc-664f-464e-b32f-a6b6d28809f6&da_id=navigation&da_position=2&id_origin=/home/dynamic_access&da_sort_algorithm=ranker';
    const resolved = await urlResolutionService.resolveFinalUrl(url);

    expect(resolved).toBe('https://www.mercadolivre.com.br/multivitaminico-120-caps-growth-supplements-sabor-neutro-nova-formula/p/MLB21555776');
  });

  test('Deve resolver encurtador meli.la', async () => {
    const url = 'https://meli.la/1yjEbf9';
    const resolved = await urlResolutionService.resolveFinalUrl(url);
    expect(resolved).toBe('https://www.mercadolivre.com.br/multivitaminico-120-caps-growth-supplements-sabor-neutro-nova-formula/p/MLB21555776');
  });

  test('Deve resolver encurtador /sec/', async () => {
    const url = 'https://mercadolivre.com/sec/2mZSs8j';
    const resolved = await urlResolutionService.resolveFinalUrl(url);

    expect(resolved).toBe('https://www.mercadolivre.com.br/principia-kit-shampoo-e-condicionador-antiqueda-aq-01/p/MLB37347975');
  });
});