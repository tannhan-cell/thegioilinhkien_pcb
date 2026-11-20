import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../lib/types';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Check, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const discountPercent = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-lg bg-rose-500 text-white font-mono text-[11px] font-bold shadow-md">
          -{discountPercent}%
        </span>
      )}

      {/* Product Image */}
      <Link to={`/products/${product.slug}`} className="relative block aspect-square bg-slate-100 overflow-hidden">
        <img
          src={product.thumbnail || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Info Body */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="text-blue-600 font-semibold">{product.brand}</span>
            <span>SKU: {product.sku}</span>
          </div>

          <Link
            to={`/products/${product.slug}`}
            className="block font-semibold text-sm text-slate-800 group-hover:text-blue-600 transition line-clamp-2 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-base sm:text-lg font-bold font-mono text-blue-700">
              {product.price.toLocaleString('vi-VN')} đ
            </div>
            {product.comparePrice && product.comparePrice > product.price && (
              <div className="text-xs text-slate-400 font-mono line-through">
                {product.comparePrice.toLocaleString('vi-VN')} đ
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm disabled:opacity-40"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
