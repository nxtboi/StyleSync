import { motion } from "motion/react";
import { ShoppingBag, Menu, Search, User } from "lucide-react";

export default function Navbar({ onNavigate }: { onNavigate: (page: 'home' | 'studio' | 'styleme') => void }) {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2, ease: [0.76, 0, 0.24, 1] }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex items-center justify-between"
    >
      <div className="flex items-center gap-12">
        <button 
          onClick={() => onNavigate('home')}
          className="font-display text-3xl tracking-tighter hover:text-brand-accent transition-colors"
        >
          STYLESYNC
        </button>
        
        <div className="hidden md:flex items-center gap-8 font-space text-xs uppercase tracking-widest opacity-60">
          <button onClick={() => onNavigate('home')} className="hover:opacity-100 transition-opacity">Power Trends</button>
          <button onClick={() => onNavigate('studio')} className="hover:text-brand-accent hover:opacity-100 transition-opacity flex items-center gap-2">
            Virtual Studio <span className="px-1.5 py-0.5 bg-brand-accent text-brand-black text-[8px] rounded font-bold">AI</span>
          </button>
          <button onClick={() => onNavigate('styleme')} className="hover:opacity-100 transition-opacity">Style Me</button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Search size={18} />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <User size={18} />
        </button>
        <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
          <ShoppingBag size={18} />
          <span className="absolute top-0 right-0 w-4 h-4 bg-brand-accent rounded-full text-[10px] flex items-center justify-center font-bold">
            0
          </span>
        </button>
        <button className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
          <Menu size={18} />
        </button>
      </div>
    </motion.nav>
  );
}
