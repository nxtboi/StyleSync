import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import Loader from "./components/Loader";
import Scene from "./components/Scene";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import VirtualStudio from "./components/VirtualStudio";
import StyleMe from "./components/StyleMe";
import { PRODUCTS } from "./types";
import { ArrowRight, Instagram, Twitter, Youtube, Globe, ArrowUpRight } from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'studio' | 'styleme'>('home');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (page: 'home' | 'studio' | 'styleme') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="relative min-h-screen bg-brand-black">
      <Loader />
      
      {!isLoading && (
        <>
          <Scene />
          <Navbar onNavigate={handleNavigate} />
          
          <AnimatePresence mode="wait">
            {currentPage === 'home' ? (
              <motion.div 
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                ref={scrollRef} 
                className="relative z-10"
              >
                <Hero />

                {/* Featured Section */}
                <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                      <motion.h2 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="font-display text-6xl md:text-8xl leading-none tracking-tighter uppercase mb-8"
                      >
                        POWER <br />
                        <span className="text-stroke">TRENDS</span>
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.6 }}
                        viewport={{ once: true }}
                        className="font-space text-lg leading-relaxed max-w-lg"
                      >
                        The most viral fashion trends indexed from top platforms like 
                        Myntra, Ajio, Amazon, Flipkart, and Nykaa. Stay ahead of the 
                        curve with real-time style data.
                      </motion.p>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4 font-space text-xs uppercase tracking-[0.3em] font-bold cursor-pointer group"
                    >
                      View All Trends
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-brand-accent group-hover:border-brand-accent transition-all">
                        <ArrowRight size={16} className="group-hover:text-brand-black transition-colors" />
                      </div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {PRODUCTS.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>

                  {/* Similar Trends Section */}
                  <div className="mt-40">
                    <motion.h3 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="font-display text-4xl uppercase tracking-tighter mb-12"
                    >
                      SIMILAR <span className="text-stroke text-white/20">TRENDS</span>
                    </motion.h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {PRODUCTS.slice(4, 7).map((product, index) => (
                        <ProductCard key={`similar-${product.id}`} product={product} index={index} />
                      ))}
                    </div>
                  </div>
                </section>

                {/* Parallax Banner */}
                <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden flex items-center justify-center my-32">
                  <motion.div 
                    initial={{ scale: 1.2 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=2000" 
                      alt="Banner" 
                      className="w-full h-full object-cover opacity-40"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                  
                  <div className="relative z-10 text-center px-6">
                    <motion.h2 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="font-display text-7xl md:text-[12vw] leading-none tracking-tighter uppercase"
                    >
                      FUTURE <br />
                      <span className="text-stroke">ARCHIVE</span>
                    </motion.h2>
                    <motion.button 
                      onClick={() => handleNavigate('studio')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-12 px-10 py-5 glass-panel rounded-full font-space font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-brand-black transition-all"
                    >
                      Explore the Studio
                    </motion.button>
                  </div>
                </section>

                {/* Categories / Bento Grid */}
                <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[1000px] md:h-[600px]">
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="md:col-span-8 relative overflow-hidden rounded-3xl group cursor-pointer"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000" 
                        alt="Outerwear" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-10 flex flex-col justify-end">
                        <h3 className="font-display text-5xl uppercase tracking-tighter">Outerwear</h3>
                        <p className="font-space text-sm opacity-60 mt-2 uppercase tracking-widest">24 Pieces Available</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="md:col-span-4 relative overflow-hidden rounded-3xl group cursor-pointer"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000" 
                        alt="Accessories" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-10 flex flex-col justify-end">
                        <h3 className="font-display text-4xl uppercase tracking-tighter">Accessories</h3>
                        <p className="font-space text-sm opacity-60 mt-2 uppercase tracking-widest">12 Pieces Available</p>
                      </div>
                    </motion.div>
                  </div>
                </section>
              </motion.div>
            ) : currentPage === 'studio' ? (
              <motion.div
                key="studio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <VirtualStudio />
              </motion.div>
            ) : (
              <motion.div
                key="styleme"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <StyleMe />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <footer className="relative z-10 bg-white/5 border-t border-white/10 pt-32 pb-12 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-32">
                <div className="md:col-span-6">
                  <h2 className="font-display text-7xl md:text-9xl leading-none tracking-tighter uppercase mb-12">
                    JOIN THE <br />
                    <span className="text-brand-accent">VOID</span>
                  </h2>
                  <div className="flex gap-4">
                    <input 
                      type="email" 
                      placeholder="EMAIL ADDRESS" 
                      className="flex-1 bg-transparent border-b border-white/20 py-4 font-space text-sm focus:border-brand-accent outline-none transition-colors"
                    />
                    <button className="px-8 py-4 bg-brand-white text-brand-black font-space font-bold text-xs uppercase tracking-widest rounded-full hover:bg-brand-accent transition-colors">
                      Sign Up
                    </button>
                  </div>
                </div>
                
                <div className="md:col-span-3 flex flex-col gap-8">
                  <h4 className="font-space text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Navigation</h4>
                  <ul className="flex flex-col gap-4 font-space text-sm uppercase tracking-widest">
                    <li><button onClick={() => handleNavigate('home')} className="hover:text-brand-accent transition-colors">Shop All</button></li>
                    <li><button onClick={() => handleNavigate('home')} className="hover:text-brand-accent transition-colors">Collections</button></li>
                    <li><button onClick={() => handleNavigate('studio')} className="hover:text-brand-accent transition-colors">Virtual Studio</button></li>
                    <li><button onClick={() => handleNavigate('styleme')} className="hover:text-brand-accent transition-colors">Style Me</button></li>
                  </ul>
                </div>

                <div className="md:col-span-3 flex flex-col gap-8">
                  <h4 className="font-space text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Social</h4>
                  <ul className="flex flex-col gap-4 font-space text-sm uppercase tracking-widest">
                    <li><a href="#" className="flex items-center justify-between hover:text-brand-accent transition-colors">Instagram <ArrowUpRight size={14} /></a></li>
                    <li><a href="#" className="flex items-center justify-between hover:text-brand-accent transition-colors">Twitter <ArrowUpRight size={14} /></a></li>
                    <li><a href="#" className="flex items-center justify-between hover:text-brand-accent transition-colors">Youtube <ArrowUpRight size={14} /></a></li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/10 gap-8">
                <p className="font-space text-[10px] uppercase tracking-widest opacity-40">
                  © 2026 STYLESYNC STUDIO. ALL RIGHTS RESERVED.
                </p>
                
                <div className="flex items-center gap-8 font-space text-[10px] uppercase tracking-widest opacity-40">
                  <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
                  <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
                  <div className="flex items-center gap-2">
                    <Globe size={12} />
                    <span>EN / USD</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}
