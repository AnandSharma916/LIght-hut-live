import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { productService } from '../../services/api';
import { ProductCard } from '../catalog/ProductCard';

export const FeaturedProductsSection = ({ section }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts({ featured: true, limit: 8 });
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const title = section?.title || 'Featured Lighting Collection';
  const subtitle = section?.subtitle || 'MOST LOVED DESIGNS';
  const description =
    section?.description ||
    'Discover our most popular chandeliers, statement pendants, and ambient wall lamps handpicked for modern Indian homes.';
  const btnText = section?.buttonText || 'View All Lights';
  const btnLink = section?.buttonLink || '/catalog';

  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[10px] uppercase tracking-wider text-[#DC2626] font-bold mb-3">
              <Sparkles className="w-3 h-3 text-[#DC2626]" />
              <span>{subtitle}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-neutral-900 tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
              {description}
            </p>
          </div>
          <Link
            to={btnLink}
            className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs uppercase tracking-luxury shadow-md transition-all transform hover:-translate-y-0.5 shrink-0"
          >
            <span>{btnText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} hidePricing={true} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
