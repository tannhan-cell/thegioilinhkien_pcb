import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { Product } from '../lib/types';
import { useCart } from '../context/CartContext';
import { 
  ShoppingCart, 
  Zap, 
  FileText, 
  Check, 
  ChevronRight, 
  Truck, 
  ShieldCheck, 
  ArrowLeft,
  Share2
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const item = await db.getProductBySlug(slug);
        setProduct(item);
        if (item) {
          setSelectedImage(item.thumbnail || item.images[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Đang tải thông tin sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy sản phẩm!</h2>
        <p className="text-xs text-slate-500">Sản phẩm này có thể đã bị xóa hoặc tạm ngưng bán.</p>
        <Link to="/products" className="inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl">
          Quay lại danh mục sản phẩm
        </Link>
      </div>
    );
  }

  const discountPercent = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link to="/" className="hover:text-blue-600 transition">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/products" className="hover:text-blue-600 transition">Sản phẩm</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-xl bg-rose-500 text-white font-mono text-xs font-bold shadow-md">
                  Tiết kiệm {discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      selectedImage === img ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand & Stock */}
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold font-mono">
                  {product.brand}
                </span>
                <span className="font-mono text-slate-500">
                  SKU: <b className="text-slate-800">{product.sku}</b>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h1>

              {/* Price Banner */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-700">
                  {product.price.toLocaleString('vi-VN')} đ
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-sm sm:text-base font-mono text-slate-400 line-through">
                    {product.comparePrice.toLocaleString('vi-VN')} đ
                  </span>
                )}
                <span className="text-xs text-slate-500 ml-auto">
                  Đơn vị tính: <b>{product.unit}</b>
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Datasheet Link */}
              {product.datasheetUrl && (
                <div className="pt-1">
                  <a
                    href={product.datasheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-mono font-semibold transition"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Tải Datasheet Kỹ Thuật (PDF)</span>
                  </a>
                </div>
              )}
            </div>

            {/* Actions: Quantity & Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-700">Số lượng:</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 font-mono font-semibold text-sm text-slate-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  (Còn {product.stock} {product.unit} trong kho)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => addToCart(product, quantity)}
                  disabled={product.stock <= 0}
                  className="py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl border border-blue-200 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>THÊM VÀO GIỎ</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <Zap className="w-4 h-4" />
                  <span>MUA NGAY</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Giao hàng COD toàn quốc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Bảo hành test 1 đổi 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        {product.attributes && product.attributes.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
              Thông Số Kỹ Thuật Chi Tiết
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <tbody>
                  {product.attributes.map((attr, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}
                    >
                      <td className="py-3 px-4 font-semibold text-slate-700 w-1/3 border-b border-slate-100">
                        {attr.name}
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-mono border-b border-slate-100">
                        {attr.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
