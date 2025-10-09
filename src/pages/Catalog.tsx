// src/pages/Catalog.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Package, 
  Box, 
  Cigarette, 
  Hash, 
  Sparkles,
  ChevronLeft,
  Filter,
  ArrowRight
} from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { useProductsStore } from '../store/productsStore';
import Product3DView from '../components/products/Product3DView';

// Product types
interface ProductType {
  id: string;
  name: string;
  icon: typeof Package;
  description: string;
}

const productTypes: ProductType[] = [
  {
    id: 'plastic-bags',
    name: 'Plastic Bags',
    icon: Package,
    description: 'Airtight packaging for freshness'
  },
  {
    id: 'boxes',
    name: 'Boxes with Tubes',
    icon: Box,
    description: 'Premium packaging with tubes'
  },
  {
    id: 'nano-blunts',
    name: 'Nano Blunts',
    icon: Cigarette,
    description: 'Compact blunts'
  },
  {
    id: 'hash-rosin',
    name: 'HASH/ROSIN',
    icon: Hash,
    description: 'Premium concentrates'
  },
  {
    id: 'big-blunts',
    name: 'Big Blunts',
    icon: Sparkles,
    description: 'Premium large-size blunts'
  }
];

const Catalog: React.FC = () => {
  const location = useLocation();
  const { products } = useProductsStore();
  
  const initialStrainType = location.state?.strainType || null;
  
  const [selectedStrain, setSelectedStrain] = useState<'CYAN' | 'WHITE' | 'BLACK' | null>(initialStrainType);
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Strain information
  const strainInfo = {
    CYAN: {
      name: 'Cyan Edition',
      subtitle: 'Hybrid Strains',
      gradient: 'from-cyan-400 to-blue-600',
      bgGradient: 'from-cyan-400/10 to-blue-600/10',
      description: 'Perfect balance of effects',
      productType: 'blunts'
    },
    WHITE: {
      name: 'White Edition', 
      subtitle: 'Sativa Strains',
      gradient: 'from-gray-100 to-white',
      bgGradient: 'from-gray-100/10 to-white/10',
      description: 'Energy and focus',
      productType: 'flowers'
    },
    BLACK: {
      name: 'Black Edition',
      subtitle: 'Indica Strains',
      gradient: 'from-gray-700 to-black',
      bgGradient: 'from-gray-700/10 to-black/10',
      description: 'Deep relaxation',
      productType: 'prerolls'
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    if (selectedStrain && product.type !== selectedStrain) return false;
    if (selectedProductType && product.productCategory !== selectedProductType) {
      return false;
    }
    return true;
  });

  const handleStrainSelect = (strain: 'CYAN' | 'WHITE' | 'BLACK') => {
    setSelectedStrain(strain);
    setSelectedProductType(null);
  };

  const handleBackToStrains = () => {
    setSelectedStrain(null);
    setSelectedProductType(null);
  };

  return (
    <div className="min-h-screen bg-black pt-24 lg:pt-28 pb-24">
      <div className="container mx-auto px-4">
        
        {/* If no strain selected - show strain selection */}
        {!selectedStrain ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-16">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl lg:text-6xl font-bold mb-4"
              >
                <span className="gradient-text">Product</span> Catalog
              </motion.h1>
              <p className="text-xl text-gray-400">Choose strain category</p>
            </div>

            {/* Strain Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {Object.entries(strainInfo).map(([key, info], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => handleStrainSelect(key as 'CYAN' | 'WHITE' | 'BLACK')}
                  className="cursor-pointer group"
                >
                  <div className={`relative h-full glass-dark rounded-3xl p-8 overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500`}>
                    {/* Background Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${info.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* 3D Model */}
                    <div className="relative h-48 mb-6">
                      <Product3DView 
                        productType={info.productType}
                        minimal={true}
                      />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${info.gradient} bg-clip-text text-transparent`}>
                        {info.name}
                      </h3>
                      <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
                        {info.subtitle}
                      </p>
                      <p className="text-gray-400 mb-6">
                        {info.description}
                      </p>
                      
                      {/* CTA */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-3 px-6 rounded-xl bg-gradient-to-r ${info.gradient} text-center font-semibold transition-all duration-300 ${
                          key === 'WHITE' ? 'text-black' : 'text-white'
                        }`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          Select
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* If strain selected - show product types and products */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header with Back Button */}
            <div className="mb-12">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToStrains}
                className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to categories</span>
              </motion.button>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 className={`text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r ${strainInfo[selectedStrain].gradient} bg-clip-text text-transparent`}>
                    {strainInfo[selectedStrain].name}
                  </h1>
                  <p className="text-xl text-gray-400">
                    {strainInfo[selectedStrain].subtitle}
                  </p>
                </div>

                {/* Filter Button for Mobile */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-6 py-3 glass-dark rounded-xl"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </motion.button>
              </div>
            </div>

            {/* Product Types Filter */}
            <AnimatePresence>
              {(showFilters || window.innerWidth >= 1024) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-12"
                >
                  <h3 className="text-lg font-semibold text-gray-300 mb-6">Product Types:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {productTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedProductType === type.id;
                      
                      return (
                        <motion.button
                          key={type.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedProductType(isSelected ? null : type.id)}
                          className={`relative p-4 rounded-xl transition-all duration-300 ${
                            isSelected
                              ? 'glass-dark bg-primary/20 border-primary'
                              : 'glass-dark hover:bg-white/10'
                          } border border-white/10`}
                        >
                          <Icon className={`w-6 h-6 mb-2 mx-auto ${
                            isSelected ? 'text-primary' : 'text-gray-400'
                          }`} />
                          <p className={`text-sm font-medium ${
                            isSelected ? 'text-white' : 'text-gray-400'
                          }`}>
                            {type.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {type.description}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Clear Filter */}
                  {selectedProductType && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedProductType(null)}
                      className="mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Clear filter ✕
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-8 text-gray-400"
            >
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </motion.div>

            {/* Products Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedStrain}-${selectedProductType}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No products</h3>
                <p className="text-gray-400 mb-6">
                  {selectedProductType 
                    ? 'No products in this category yet'
                    : 'No products in this collection yet'}
                </p>
                <button
                  onClick={() => setSelectedProductType(null)}
                  className="px-6 py-3 gradient-primary text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(35,192,219,0.5)] transition-all duration-300"
                >
                  Show all products
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Catalog;