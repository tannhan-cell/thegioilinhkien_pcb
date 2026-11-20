import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../lib/db';
import { Product, Category } from '../lib/types';
import { ProductCard } from '../components/shop/ProductCard';
import { Search, Filter, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodList, catList] = await Promise.all([
          db.getProducts(),
          db.getCategories(),
        ]);
        setProducts(prodList);
        setCategories(catList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract all unique brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { if (p.brand) set.add(p.brand); });
    return Array.from(set);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Search
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchBrand) return false;
        }
        // Category
        if (selectedCategory !== 'all') {
          if (p.categorySlug !== selectedCategory && p.category !== selectedCategory) return false;
        }
        // Brand
        if (selectedBrand !== 'all') {
          if (p.brand !== selectedBrand) return false;
        }
        // Stock
        if (onlyInStock && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, search, selectedCategory, selectedBrand, onlyInStock, sortBy]);

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setOnlyInStock(false);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Linh Kiện Điện Tử
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Phân phối vi điều khiển, module IoT, cảm biến, linh kiện dán SMD chính hãng cho dự án của bạn
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Tìm tên, SKU, mã linh kiện..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Sidebar Filters & Products List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              Bộ Lọc Tìm Kiếm
            </span>
            <button
              onClick={clearAllFilters}
              className="text-xs text-blue-600 hover:underline"
            >
              Đặt lại
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Danh Mục Sản Phẩm
            </h4>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === 'all'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Tất cả danh mục ({products.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedCategory === c.slug
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Thương Hiệu
            </h4>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả thương hiệu</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Chỉ hiển thị hàng có sẵn</span>
            </label>
          </div>
        </aside>

        {/* Products Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sorting & Result Count Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
            <div className="text-slate-500">
              Tìm thấy <b className="text-slate-800">{filteredProducts.length}</b> sản phẩm
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 shrink-0">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các tiêu chí lọc.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
