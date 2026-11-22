import React, { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { Product, Category } from '../../lib/types';
import { 
  Package, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  Image as ImageIcon,
  FolderPlus,
  Layers,
  Check
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quick add category state
  const [showAddCatInline, setShowAddCatInline] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [comparePrice, setComparePrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(100);
  const [unit, setUnit] = useState('Cái');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [datasheetUrl, setDatasheetUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchAll = async () => {
    try {
      const [prodList, catList] = await Promise.all([
        db.getProducts(),
        db.getCategories(),
      ]);
      setProducts(prodList);
      setCategories(catList);
      if (catList.length > 0 && !category) {
        setCategory(catList[0].name);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddNewCategory = async () => {
    if (!newCatName.trim()) return;
    const catSlug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: newCatName.trim(),
      slug: catSlug || 'linh-kien-' + Date.now(),
      description: 'Linh kiện ' + newCatName.trim(),
      icon: 'fa-microchip',
      productCount: 0,
    };

    await db.saveCategory(newCat);
    await fetchAll();
    setCategory(newCat.name);
    setNewCatName('');
    setShowAddCatInline(false);
  };

  const handleDeleteCategory = async (id: string, catName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${catName}" không?`)) {
      await db.deleteCategory(id);
      await fetchAll();
      if (category === catName) {
        setCategory(categories.find(c => c.id !== id)?.name || '');
      }
    }
  };

  const openNewModal = () => {
    setSelectedProduct(null);
    setName('');
    setSku('SKU-' + Math.floor(1000 + Math.random() * 9000));
    setCategory(categories[0]?.name || 'Vi điều khiển & Mạch nạp');
    setBrand('OEM');
    setPrice(50000);
    setComparePrice(0);
    setStock(100);
    setUnit('Cái');
    setThumbnail('https://images.unsplash.com/photo-1518770660439-4636190af475?w=600');
    setDescription('');
    setDatasheetUrl('');
    setShowAddCatInline(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setSelectedProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setBrand(p.brand);
    setPrice(p.price);
    setComparePrice(p.comparePrice || 0);
    setStock(p.stock);
    setUnit(p.unit);
    setThumbnail(p.thumbnail);
    setDescription(p.description);
    setDatasheetUrl(p.datasheetUrl || '');
    setShowAddCatInline(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa linh kiện này?')) {
      await db.deleteProduct(id);
      await fetchAll();
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const catObj = categories.find(c => c.name === category);

      const productPayload: Product = {
        id: selectedProduct ? selectedProduct.id : 'prod-' + Date.now(),
        sku: sku.trim(),
        name: name.trim(),
        slug: selectedProduct ? selectedProduct.slug : slug,
        category,
        categorySlug: catObj ? catObj.slug : 'linh-kien',
        brand: brand.trim(),
        price: Number(price),
        comparePrice: comparePrice > 0 ? Number(comparePrice) : undefined,
        stock: Number(stock),
        unit: unit.trim(),
        thumbnail: thumbnail.trim(),
        images: [thumbnail.trim()],
        description: description.trim(),
        datasheetUrl: datasheetUrl.trim() || undefined,
        attributes: selectedProduct?.attributes || [],
        status: 'active',
        createdAt: selectedProduct ? selectedProduct.createdAt : new Date().toISOString(),
      };

      await db.saveProduct(productPayload);
      await fetchAll();
      setIsModalOpen(false);
    } catch (e) {
      alert('Lỗi lưu sản phẩm: ' + e);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = products.filter(p => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Quản Lý Sản Phẩm & Danh Mục Linh Kiện
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Thêm sản phẩm, tạo thêm các danh mục mới, sửa giá và điều chỉnh tồn kho linh kiện
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openNewModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Linh Kiện Mới</span>
          </button>
        </div>
      </div>

      {/* Categories Bar (View & Manage) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            Các Danh Mục Hiện Có ({categories.length})
          </span>
          <button
            type="button"
            onClick={() => setShowAddCatInline(!showAddCatInline)}
            className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo thêm danh mục mới</span>
          </button>
        </div>

        {/* Inline Add Category input */}
        {showAddCatInline && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
            <input
              type="text"
              placeholder="Nhập tên danh mục mới (VD: IC Nguồn, Màn hình OLED, Cảm biến lực...)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
            />
            <button
              type="button"
              onClick={handleAddNewCategory}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Thêm ngay</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddCatInline(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium transition group"
            >
              <span>{c.name}</span>
              <button
                type="button"
                onClick={() => handleDeleteCategory(c.id, c.name)}
                className="p-0.5 text-slate-400 hover:text-red-600 rounded transition"
                title={`Xóa danh mục "${c.name}"`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo tên linh kiện hoặc SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Linh Kiện</th>
                <th className="py-3.5 px-4">Danh Mục</th>
                <th className="py-3.5 px-4">Giá Bán</th>
                <th className="py-3.5 px-4">Tồn Kho</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={p.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 border shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800 line-clamp-1">{p.name}</div>
                        <div className="font-mono text-[11px] text-slate-400">SKU: {p.sku} • {p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{p.category}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                    {p.price.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={p.stock <= 50 ? 'text-amber-600 font-bold' : 'text-slate-800'}>
                      {p.stock} {p.unit}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
              <h3 className="text-base font-bold font-display">
                {selectedProduct ? 'Chỉnh Sửa Linh Kiện' : 'Thêm Linh Kiện Mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tên sản phẩm linh kiện:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mã SKU:</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Thương hiệu:</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Giá bán (VNĐ):</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tồn kho:</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Category selection with inline addition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">Danh mục:</label>
                    <button
                      type="button"
                      onClick={() => setShowAddCatInline(!showAddCatInline)}
                      className="text-blue-600 hover:underline text-[11px] font-semibold"
                    >
                      + Thêm danh mục khác
                    </button>
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>

                  {showAddCatInline && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Tên danh mục mới..."
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                      >
                        Thêm
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Link Ảnh Thumbnail:</label>
                  <input
                    type="url"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Link Datasheet PDF (tùy chọn):</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={datasheetUrl}
                  onChange={(e) => setDatasheetUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mô tả sản phẩm:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  {isSaving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Lưu Sản Phẩm</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
