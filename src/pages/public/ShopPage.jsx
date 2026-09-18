import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LuSearch, LuSlidersHorizontal, LuX, LuLayers } from 'react-icons/lu';
import ProductCard from '../../components/ui/ProductCard';
import { getProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { CATEGORY_IMAGES } from '../../utils/helpers';
import './ShopPage.css';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page: currentPage, limit: 12, sort };
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const { data } = await getProducts(params);
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, keyword, category, sort, minPrice, maxPrice]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = keyword || category || minPrice || maxPrice;

  return (
    <div className="page shop-page">
      {/* Header */}
      <div className="shop-header">
        <div className="container">
          <h1>Our Collection</h1>
          <p>Discover handcrafted furniture that defines your style</p>
        </div>
      </div>

      {/* Horizontal Category Tabs Ribbon */}
      <div className="shop-category-tabs-bar">
        <div className="container">
          <div className="shop-category-tabs-scroll">
            <button
              className={`shop-category-tab ${!category ? 'active' : ''}`}
              onClick={() => updateParam('category', '')}
            >
              <div className="shop-tab-icon">
                <LuLayers size={16} />
              </div>
              <span>All Products</span>
            </button>
            {categories.map((cat) => {
              const catImg = cat.image || CATEGORY_IMAGES[cat.name] || CATEGORY_IMAGES['Living Room'];
              return (
                <button
                  key={cat._id}
                  className={`shop-category-tab ${category === cat._id ? 'active' : ''}`}
                  onClick={() => updateParam('category', cat._id)}
                >
                  <img src={catImg} alt={cat.name} className="shop-tab-img" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container shop-layout">
        {/* Mobile Filter Toggle */}
        <button className="filter-toggle btn btn-outline" onClick={() => setFiltersOpen(!filtersOpen)}>
          <LuSlidersHorizontal size={18} /> Filters
        </button>

        {/* Sidebar Filters */}
        <aside className={`shop-sidebar ${filtersOpen ? 'open' : ''}`} id="shop-filters">
          <div className="sidebar-header">
            <h3>Filters</h3>
            {hasActiveFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear All</button>
            )}
            <button className="sidebar-close" onClick={() => setFiltersOpen(false)}><LuX size={20} /></button>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label>Search</label>
            <div className="filter-search">
              <LuSearch size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => updateParam('keyword', e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* Category */}
          <div className="filter-group">
            <label>Category</label>
            <div className="filter-options">
              <button
                className={`filter-option ${!category ? 'active' : ''}`}
                onClick={() => updateParam('category', '')}
              >
                <span className="filter-opt-icon"><LuLayers size={14} /></span>
                <span>All Categories</span>
              </button>
              {categories.map((cat) => {
                const catImg = cat.image || CATEGORY_IMAGES[cat.name] || CATEGORY_IMAGES['Living Room'];
                return (
                  <button
                    key={cat._id}
                    className={`filter-option ${category === cat._id ? 'active' : ''}`}
                    onClick={() => updateParam('category', cat._id)}
                  >
                    <img src={catImg} alt={cat.name} className="filter-opt-thumb" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="input"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="input"
              />
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="shop-main">
          {/* Sort Bar */}
          <div className="sort-bar">
            <p className="results-count">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
            <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="input sort-select">
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-rating">Top Rated</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>

          {loading ? (
            <div className="grid-products">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card" style={{ height: '380px' }}>
                  <div className="skeleton" style={{ height: '240px' }} />
                  <div style={{ padding: '16px' }}>
                    <div className="skeleton" style={{ height: '12px', width: '50%', marginBottom: '8px' }} />
                    <div className="skeleton" style={{ height: '16px', marginBottom: '8px' }} />
                    <div className="skeleton" style={{ height: '18px', width: '35%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className="btn btn-accent" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid-products">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => updateParam('page', String(i + 1))}
                    >{i + 1}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
