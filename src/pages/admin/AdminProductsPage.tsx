import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  Check,
  UploadCloud,
  Link as LinkIcon,
  RefreshCw,
  CheckCircle2
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
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [description, setDescription] = useState('');
  const [datasheetUrl, setDatasheetUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Canvas-based client-side image compression (max 800px, 82% quality => ~40-70KB)
  const compressImage = (file: File, maxWidth = 800, quality = 0.82): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(img.src);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = (e) => reject(e);
      };
      reader.onerror = (e) => reject(e);
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file định dạng hình ảnh (JPG, PNG, WEBP)!');
      return;
    }
    setIsUploadingImage(true);
    try {
      const dataUrl = await compressImage(file);
      setThumbnail(dataUrl);
    } catch (err) {
      console.error('Error compressing image:', err);
      alert('Lỗi xử lý hình ảnh. Vui lòng thử lại!');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleDropImage = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setIsUploadingImage(true);
    try {
      const dataUrl = await compressImage(file);
      setThumbnail(dataUrl);
    } catch (err) {
      console.error('Error compressing image:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

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
    setThumbnail('');
    setDescription('');
    setDatasheetUrl('');
    setShowAddCatInline(false);
    setImageInputMode('upload');
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
    setThumbnail(p.thumbnail || '');
    setDescription(p.description);
    setDatasheetUrl(p.datasheetUrl || '');
    setShowAddCatInline(false);
    setImageInputMode(p.thumbnail && p.thumbnail.startsWith('http') ? 'url' : 'upload');
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

      const finalThumb = thumbnail.trim() || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600';

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
        thumbnail: finalThumb,
        images: [finalThumb],
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

      {/* Modal Add / Edit Product (SỬ DỤNG PORTAL ĐỂ 100% TOÀN MÀN HÌNH KHÔNG BỊ TRÀN HAY CẮT CẢ TRÊN LẪN DƯỚI, HỖ TRỢ UP ẢNH TRỰC TIẾP) */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto p-4 sm:p-6 flex justify-center items-start sm:items-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] my-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header: sticky top-0 */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between shrink-0 sticky top-0 z-10">
              <h3 className="text-base font-bold font-display">
                {selectedProduct ? 'Chỉnh Sửa Linh Kiện' : 'Thêm Linh Kiện Mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Scrollable Form Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1 min-h-0">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tên sản phẩm linh kiện:</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Vi điều khiển ESP32-WROOM-32D 38 chân..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Thương hiệu:</label>
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
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
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold text-blue-700"
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
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Category selection with inline addition */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">Danh mục sản phẩm:</label>
                    <button
                      type="button"
                      onClick={() => setShowAddCatInline(!showAddCatInline)}
                      className="text-blue-600 hover:underline text-[11px] font-semibold cursor-pointer"
                    >
                      + Thêm danh mục mới
                    </button>
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>

                  {showAddCatInline && (
                    <div className="mt-2 flex items-center gap-1.5 p-2 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
                      <input
                        type="text"
                        placeholder="Tên danh mục mới (VD: Cảm biến khoảng cách...)"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition"
                      >
                        Thêm
                      </button>
                    </div>
                  )}
                </div>

                {/* DIRECT IMAGE UPLOAD SECTION (Tải ảnh trực tiếp từ máy tính/điện thoại hoặc nhập link URL) */}
                <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-800 font-bold flex items-center gap-1.5 text-xs">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span>Hình Ảnh Linh Kiện:</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setImageInputMode(imageInputMode === 'upload' ? 'url' : 'upload')}
                      className="text-[11px] text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {imageInputMode === 'upload' ? (
                        <>
                          <LinkIcon className="w-3 h-3" />
                          <span>Hoặc dùng link URL ảnh</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3 h-3" />
                          <span>Tải ảnh từ máy tính</span>
                        </>
                      )}
                    </button>
                  </div>

                  {imageInputMode === 'upload' ? (
                    <div>
                      {thumbnail ? (
                        <div className="flex items-center gap-3.5 p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                          <img
                            src={thumbnail}
                            alt="Preview linh kiện"
                            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg bg-slate-50 border border-slate-200 p-1 shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Đã tải ảnh lên thành công</span>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1">
                              Ảnh đã được tự động nén tối ưu hiển thị nhanh siêu nhẹ
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <label className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1">
                                <RefreshCw className="w-3 h-3" />
                                <span>Đổi ảnh khác</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageFileChange}
                                  className="hidden"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => setThumbnail('')}
                                className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Xóa ảnh</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDropImage}
                          className="border-2 border-dashed border-blue-200 hover:border-blue-500 bg-white hover:bg-blue-50/50 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition group"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition shadow-inner">
                            {isUploadingImage ? (
                              <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                              <UploadCloud className="w-5 h-5" />
                            )}
                          </div>
                          <div className="text-xs font-bold text-slate-800">
                            {isUploadingImage ? 'Đang nén và xử lý ảnh...' : 'Nhấn vào đây để tải ảnh trực tiếp từ máy tính'}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            Hỗ trợ chọn file ảnh từ máy hoặc kéo thả vào đây (JPG, PNG, WebP)
                          </div>
                        </label>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="url"
                        placeholder="Dán link ảnh tại đây (VD: https://images.unsplash.com/...)"
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500"
                      />
                      {thumbnail && (
                        <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200">
                          <img src={thumbnail} alt="Preview" className="w-10 h-10 object-contain rounded bg-slate-50 border shrink-0" />
                          <span className="text-[11px] text-slate-500 truncate font-mono">{thumbnail}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Link Datasheet PDF (tùy chọn):</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={datasheetUrl}
                    onChange={(e) => setDatasheetUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mô tả sản phẩm:</label>
                  <textarea
                    rows={3}
                    placeholder="Nhập thông số kỹ thuật, ứng dụng hoặc mô tả linh kiện..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Sticky Footer: luôn hiển thị ở dưới đáy modal, không bao giờ bị cắt */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0 sticky bottom-0 z-10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                >
                  {isSaving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Lưu Sản Phẩm</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
