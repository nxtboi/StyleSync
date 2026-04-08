import { motion } from "motion/react";
import { Product } from "../types";
import { ShoppingBag, Heart, Plus } from "lucide-react";
import { cn } from "../lib/utils";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const handleRedirect = () => {
    let searchUrl = "";
    const query = encodeURIComponent(product.name);
    
    switch (product.platform) {
      case 'Myntra':
        searchUrl = `https://www.myntra.com/${query}`;
        break;
      case 'Ajio':
        searchUrl = `https://www.ajio.com/search/?text=${query}`;
        break;
      case 'Amazon':
        searchUrl = `https://www.amazon.in/s?k=${query}`;
        break;
      case 'Flipkart':
        searchUrl = `https://www.flipkart.com/search?q=${query}`;
        break;
      case 'Nykaa':
        searchUrl = `https://www.nykaa.com/search/result/?q=${query}`;
        break;
      default:
        searchUrl = product.sourceUrl;
    }
    
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onClick={handleRedirect}
      className="group relative flex flex-col gap-4 cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white/5">
        <motion.img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 py-3 bg-brand-white text-brand-black rounded-full font-space font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
          >
            Search Similar on {product.platform}
            <Plus size={14} />
          </motion.div>
        </div>

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 glass-panel rounded-full text-[10px] font-space font-bold tracking-widest uppercase">
            {product.category}
          </span>
          <span className="px-3 py-1 bg-brand-accent text-brand-black rounded-full text-[8px] font-space font-bold tracking-widest uppercase w-fit">
            {product.platform}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-start px-2">
        <div>
          <h3 className="font-display text-xl tracking-tight group-hover:text-brand-accent transition-colors">
            {product.name}
          </h3>
          <p className="font-space text-xs opacity-50 uppercase tracking-widest mt-1">
            Trending on {product.platform}
          </p>
        </div>
        <div className="text-right">
          <p className="font-space font-bold text-lg">₹{product.price}</p>
          <div className="flex gap-1 mt-2 justify-end">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-brand-accent" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
