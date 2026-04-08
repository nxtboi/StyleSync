import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.div 
        style={{ y, opacity, scale }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.76, 0, 0.24, 1] }}
          className="mb-6 px-4 py-1 glass-panel rounded-full text-[10px] uppercase tracking-[0.3em] font-space font-bold"
        >
          SPRING / SUMMER 2026
        </motion.div>
        
        <div className="relative">
          <motion.h1 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.6, ease: [0.76, 0, 0.24, 1] }}
            className="font-display text-[18vw] md:text-[15vw] leading-[0.85] tracking-tighter uppercase"
          >
            AURA <br />
            <span className="text-stroke">STUDIO</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.2, type: "spring" }}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-brand-accent rounded-full flex items-center justify-center rotate-12 hover:rotate-0 transition-transform cursor-pointer"
          >
            <p className="font-display text-xl md:text-2xl text-brand-black leading-none text-center">
              NEW <br /> DROP
            </p>
          </motion.div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 2.4 }}
          className="mt-12 max-w-md font-space text-sm md:text-base leading-relaxed tracking-wide px-6"
        >
          Experience the intersection of digital art and high-end streetwear. 
          Limited edition pieces designed for the modern void.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-12 flex items-center gap-4 px-8 py-4 bg-brand-white text-brand-black font-space font-bold text-sm uppercase tracking-widest rounded-full group"
        >
          Shop Collection
          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1, delay: 3, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-space text-[10px] uppercase tracking-widest">Scroll</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}
