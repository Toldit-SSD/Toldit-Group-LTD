/* Shared by the browser and the dependency-free regression suite. */
(() => {
  const normalize = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const aliases = { 'Food & drink': 'food drinks', 'Home & care': 'home household care cleaning', Fragrances: 'perfume perfumes fragrance', 'Apparel & gear': 'clothing clothes bags', Technology: 'tech electronics', Education: 'school stationery' };
  const matchesSearch = (product, query) => {
    const haystack = normalize([product.name, product.description, product.category, product.format, product.origin, aliases[product.category], /peanut/i.test(product.name) ? 'groundnut groundnuts' : ''].filter(Boolean).join(' '));
    return normalize(query).split(/\s+/).filter(Boolean).every(word => haystack.includes(word));
  };
  function readState(search, products) {
    const params = new URLSearchParams(search);
    const category = params.get('category');
    return { query: (params.get('q') || '').slice(0, 120), category: products.some(p => p.category === category) ? category : 'All products', sort: ['az', 'za'].includes(params.get('sort')) ? params.get('sort') : 'featured' };
  }
  function searchParams(state) {
    const params = new URLSearchParams();
    if (state.query.trim()) params.set('q', state.query.trim());
    if (state.category !== 'All products') params.set('category', state.category);
    if (state.sort !== 'featured') params.set('sort', state.sort);
    return params.toString();
  }
  function filter(products, state) {
    const result = products.filter(p => matchesSearch(p, state.query) && (state.category === 'All products' || p.category === state.category));
    if (state.sort !== 'featured') result.sort((a, b) => state.sort === 'az' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    return result;
  }
  globalThis.TolditCatalog = { normalize, matchesSearch, readState, searchParams, filter };
})();
