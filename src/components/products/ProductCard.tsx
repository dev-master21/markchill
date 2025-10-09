import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Sparkles, Zap, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem } = useCartStore();

  const typeColors = {
    WHITE: 'from-gray-200 to-white',
    BLACK: 'from-gray-700 to-black',
    CYAN: 'from-cyan-400 to-blue-500'
  };

  const typeBgGradients = {
    WHITE: 'from-gray-100/20 to-white/10',
    BLACK: 'from-gray-800/20 to-black/10',
    CYAN: 'from-cyan-400/20 to-blue-500/10'
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!product.inStock) {
      toast.error('Product is out of stock');
      return;
    }

    // Передаем сам продукт, а не создаем новый объект
    addItem(product, 1, product.strains?.[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-full"
    >
      <Link to={`/product/${product.slug}`} className="block h-full">
        <div className="relative h-full bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500">
          {/* Background Gradient Effect */}
          <motion.div
            animate={{
              opacity: isHovered ? 0.15 : 0.05,
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${typeBgGradients[product.type]} blur-xl`}
            />
          </motion.div>

          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-black/20">
            <motion.div
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotateZ: isHovered ? 2 : 0,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
              )}
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              
              {/* Type Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md bg-gradient-to-r ${typeColors[product.type]} text-black z-20 shadow-lg`}
              >
                {product.type}
              </motion.div>

              {/* Featured/New Badges */}
              {(product.featured || product.new) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-4 right-4 flex flex-col gap-2 z-20"
                >
                  {product.featured && (
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black flex items-center gap-1 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      FEATURED
                    </div>
                  )}
                  {product.new && (
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-black flex items-center gap-1 shadow-lg">
                      <Zap className="w-3 h-3" />
                      NEW
                    </div>
                  )}
                </motion.div>
              )}

              {/* Discount Badge */}
              {product.discount && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg z-20"
                >
                  <div className="text-center">
                    <div className="text-xs font-bold text-white">-{product.discount}%</div>
                  </div>
                </motion.div>
              )}

              {/* Hover Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"
              />

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0, 
                  y: isHovered ? 0 : 20 
                }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-4 right-4 flex gap-2 z-20"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleQuickAdd}
                  disabled={!product.inStock}
                  className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-lg ${
                    product.inStock
                      ? 'bg-primary/80 hover:bg-primary text-black'
                      : 'bg-gray-500/50 cursor-not-allowed text-gray-400'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-all shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="p-6 space-y-4">
            {/* Category & Strains */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {product.category}
              </span>
              {product.strains && product.strains.length > 0 && (
                <div className="flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-gray-400">
                    {product.strains.length} strains
                  </span>
                </div>
              )}
            </div>

            {/* Product Name */}
            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>

            {/* Features Preview */}
            <div className="space-y-1">
              {product.features.slice(0, 2).map((feature, i) => (
                <p key={i} className="text-xs text-gray-500 line-clamp-1">
                  • {feature}
                </p>
              ))}
            </div>

          {/* Product Details */}
          <div className="flex items-center justify-between text-sm">
            {product.sizes && product.sizes.length > 0 && (
              <p className="text-xs text-gray-500">{product.sizes[0]}</p>
            )}
          </div>

            {product.thc && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">THC</span>
                <p className="text-lg font-bold gradient-text">{product.thc}</p>
              </div>
            )}

            {/* Price & Stock */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    ฿{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ฿{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Stock Status */}
              <div className={`text-xs font-medium ${
                product.inStock ? 'text-green-400' : 'text-red-400'
              }`}>
                {product.inStock ? (
                  product.stock < 10 ? `${product.stock} left` : 'In Stock'
                ) : (
                  'Out of Stock'
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}