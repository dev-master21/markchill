import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
  Shield,
  Package,
  Sparkles,
  Zap,
  Leaf,
  Sun,
  Mountain,
  Cloud,
  Wind,
  Scale
} from 'lucide-react';
import type { Strain } from '../types';
import { useProductsStore } from '../store/productsStore';
import { useCartStore } from '../store/cartStore';
import { toast } from 'sonner';

const strainIcons: Record<Strain, React.ReactNode> = {
  Mimosa: <Sun className="w-4 h-4" />,
  'Lemon Mint': <Leaf className="w-4 h-4" />,
  Classic: <Cloud className="w-4 h-4" />,
  'Pinapple Express': <Zap className="w-4 h-4" />,
  'Gorilla Glue': <Mountain className="w-4 h-4" />,
  'Grape Stomper': <Sparkles className="w-4 h-4" />,
  'Strawberry Cough': <Heart className="w-4 h-4" />,
  'Green Haze': <Wind className="w-4 h-4" />,
};

const strainColors: Record<Strain, string> = {
  Mimosa: 'from-yellow-400 to-orange-500',
  'Lemon Mint': 'from-green-400 to-emerald-500',
  Classic: 'from-gray-400 to-gray-600',
  'Pinapple Express': 'from-yellow-400 to-yellow-600',
  'Gorilla Glue': 'from-purple-400 to-purple-600',
  'Grape Stomper': 'from-purple-500 to-pink-500',
  'Strawberry Cough': 'from-red-400 to-pink-500',
  'Green Haze': 'from-green-500 to-teal-500',
};

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProductBySlug } = useProductsStore();
  const { addItem } = useCartStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = slug ? getProductBySlug(slug) : undefined;

  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    if (product && product.strains && product.strains.length > 0) {
      setSelectedStrain(product.strains[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  const typeGradients = {
    WHITE: 'from-gray-100 to-white',
    BLACK: 'from-gray-800 to-black',
    CYAN: 'from-cyan-400 to-blue-500'
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (product.strains && product.strains.length > 0 && !selectedStrain) {
      toast.error('Please select a strain');
      return;
    }

    // Используем addItem с продуктом
    for (let i = 0; i < quantity; i++) {
      addItem(product, 1, selectedStrain || undefined);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </button>
            </li>
            <li className="text-gray-600">/</li>
            <li>
              <button
                onClick={() => navigate('/products')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Products
              </button>
            </li>
            <li className="text-gray-600">/</li>
            <li className="text-white">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-black/20 backdrop-blur-xl border border-white/10">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md bg-gradient-to-r ${typeGradients[product.type]} text-black shadow-lg`}
                  >
                    {product.type}
                  </motion.div>
                  {product.new && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-lg"
                    >
                      NEW ARRIVAL
                    </motion.div>
                  )}
                  {product.discount && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg"
                    >
                      -{product.discount}%
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-6 right-6 flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                      isLiked
                        ? 'bg-red-500/20 border-red-500 text-red-500'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              >
                {product.name}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400">(4.8 • 124 reviews)</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">{product.category}</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-300 text-lg leading-relaxed"
              >
                {product.description}
              </motion.p>
            </div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-white">
                  ฿{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      ฿{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold">
                      Save {product.discount}%
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Strains Selection */}
            {product.strains && product.strains.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-400" />
                  Select Strain
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {product.strains.map((strain) => (
                    <motion.button
                      key={strain}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedStrain(strain)}
                      className={`relative p-4 rounded-xl border transition-all ${
                        selectedStrain === strain ? 'bg-primary/10 text-primary' : ''
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${strainColors[strain]} opacity-10 rounded-xl`} />
                      <div className="relative space-y-2">
                        <div className="flex items-center justify-center">
                          {strainIcons[strain]}
                        </div>
                        <span className="block text-sm font-medium">{strain}</span>
                      </div>
                      {selectedStrain === strain && (
                        <motion.div
                          layoutId="strainIndicator"
                          className="absolute inset-0 border-2 border-primary rounded-xl"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  Select Size
                </h3>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-primary text-black'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quantity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white/10 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white/10 transition-colors rounded-l-xl"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-white/10 transition-colors rounded-r-xl"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-400">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all ${
                  product.inStock
                    ? 'bg-gradient-to-r from-primary to-cyan-500 hover:shadow-lg hover:shadow-primary/25'
                    : 'bg-gray-700 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </motion.button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Truck, label: 'Fast Delivery', desc: '1-3 days' },
                { icon: Shield, label: 'Secure Payment', desc: 'SSL Encrypted' },
                { icon: Package, label: 'Premium Quality', desc: 'Lab Tested' },
                { icon: Sparkles, label: 'Satisfaction', desc: '100% Guarantee' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
                >
                  <item.icon className="w-5 h-5 text-primary mb-2" />
                  <h4 className="font-semibold text-sm">{item.label}</h4>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">Product Info</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-gray-400 mb-1">Category</dt>
                  <dd className="font-medium">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-gray-400 mb-1">Type</dt>
                  <dd className="font-medium flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${typeGradients[product.type]}`} />
                    {product.type}
                  </dd>
                </div>
                {product.strains && product.strains.length > 0 && (
                  <div>
                    <dt className="text-gray-400 mb-1">Available Strains</dt>
                    <dd className="font-medium">{product.strains.join(', ')}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-400 mb-1">Sizes Available</dt>
                  <dd className="font-medium">{product.sizes?.join(', ') || 'N/A'}</dd>
                </div>
                {product.thc && (
                  <div>
                    <dt className="text-gray-400 mb-1">THC Content</dt>
                    <dd className="font-medium">{product.thc}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}