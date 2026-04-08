import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Camera, Sparkles, ArrowRight, ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react";

interface Suggestion {
  item: string;
  reason: string;
  platform: string;
  url: string;
  category: string;
}

interface AnalysisResult {
  skinTone: string;
  bodyShape: string;
  faceShape: string;
  styleProfile: string;
  suggestions: Suggestion[];
}

export default function StyleMe() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeStyle = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          type: 'analyze-style',
          payload: { image } 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const analysis = await response.json();
      setResult(analysis);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze image. Please try again with a clearer photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen bg-brand-black text-brand-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-display text-7xl md:text-9xl leading-none tracking-tighter uppercase mb-8"
            >
              STYLE <br />
              <span className="text-stroke">ME</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="font-space text-lg leading-relaxed max-w-lg"
            >
              Upload your photo and let our AI stylist analyze your features to curate 
              the perfect wardrobe from top fashion destinations.
            </motion.p>
          </div>

          <div className="w-full md:w-auto">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            {!image ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-full md:w-[400px] aspect-square border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center gap-4 group hover:border-brand-accent transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-accent group-hover:text-brand-black transition-all">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <p className="font-space font-bold uppercase tracking-widest text-sm">Upload Photo</p>
                  <p className="font-space text-[10px] opacity-40 mt-1 uppercase tracking-widest">JPG, PNG up to 10MB</p>
                </div>
              </motion.button>
            ) : (
              <div className="relative w-full md:w-[400px] aspect-square rounded-3xl overflow-hidden group">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 bg-white text-brand-black rounded-full hover:bg-brand-accent transition-colors"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
              </div>
            )}

            {image && !result && !isAnalyzing && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={analyzeStyle}
                className="w-full mt-6 py-5 bg-brand-accent text-brand-black font-space font-bold text-sm uppercase tracking-widest rounded-full flex items-center justify-center gap-3 hover:bg-white transition-all"
              >
                Analyze My Style <Sparkles size={18} />
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 flex flex-col items-center justify-center gap-8"
            >
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-brand-accent/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-brand-accent rounded-full border-t-transparent animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="font-display text-3xl uppercase tracking-tighter mb-2">Analyzing Features</h3>
                <p className="font-space text-xs opacity-40 uppercase tracking-[0.3em]">Processing skin tone, body shape & face geometry...</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-space text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Analysis Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                <div className="glass-panel p-8 rounded-3xl border border-white/10">
                  <h3 className="font-display text-2xl uppercase tracking-tighter mb-8 flex items-center gap-3">
                    Your Profile <CheckCircle2 size={20} className="text-brand-accent" />
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="font-space text-[10px] uppercase tracking-widest opacity-40 mb-1">Skin Tone</p>
                      <p className="font-space text-sm font-bold uppercase">{result.skinTone}</p>
                    </div>
                    <div>
                      <p className="font-space text-[10px] uppercase tracking-widest opacity-40 mb-1">Body Shape</p>
                      <p className="font-space text-sm font-bold uppercase">{result.bodyShape}</p>
                    </div>
                    <div>
                      <p className="font-space text-[10px] uppercase tracking-widest opacity-40 mb-1">Face Shape</p>
                      <p className="font-space text-sm font-bold uppercase">{result.faceShape}</p>
                    </div>
                    <div className="pt-6 border-t border-white/10">
                      <p className="font-space text-[10px] uppercase tracking-widest opacity-40 mb-2">Style Recommendation</p>
                      <p className="font-space text-xs leading-relaxed opacity-80 italic">"{result.styleProfile}"</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions Grid */}
              <div className="lg:col-span-8">
                <h3 className="font-display text-4xl uppercase tracking-tighter mb-12">
                  Curated <span className="text-stroke">Suggestions</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-brand-accent/50 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-space font-bold tracking-widest uppercase">
                          {suggestion.category}
                        </span>
                        <span className="px-3 py-1 bg-brand-accent text-brand-black rounded-full text-[8px] font-space font-bold tracking-widest uppercase">
                          {suggestion.platform}
                        </span>
                      </div>
                      
                      <h4 className="font-display text-xl uppercase tracking-tight mb-2 group-hover:text-brand-accent transition-colors">
                        {suggestion.item}
                      </h4>
                      <p className="font-space text-xs opacity-60 leading-relaxed mb-6">
                        {suggestion.reason}
                      </p>
                      
                      <a 
                        href={suggestion.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-space text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all"
                      >
                        Find on {suggestion.platform} <ArrowRight size={14} />
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
