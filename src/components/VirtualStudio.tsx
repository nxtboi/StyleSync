import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Sparkles, X, ArrowRight, Loader2, RefreshCw, ShoppingBag, ExternalLink, ChevronRight, Wand2, Image as ImageIcon, Key, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

interface ShoppingItem {
  name: string;
  category: 'Clothing' | 'Accessory';
  platforms: {
    name: string;
    url: string;
  }[];
}

export default function VirtualStudio() {
  const [activeTab, setActiveTab] = useState<'try-on' | 'studio'>('try-on');
  
  // Try-on state
  const [userImage, setUserImage] = useState<{data: string, mimeType: string} | null>(null);
  const [outfitImage, setOutfitImage] = useState<{data: string, mimeType: string} | null>(null);
  
  // Studio state
  const [studioPrompt, setStudioPrompt] = useState("");
  const [studioBaseImage, setStudioBaseImage] = useState<{data: string, mimeType: string} | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  const userFileRef = useRef<HTMLInputElement>(null);
  const outfitFileRef = useRef<HTMLInputElement>(null);
  const studioFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'user' | 'outfit' | 'studio') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const maxDim = 1024;
          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
          const mimeType = 'image/jpeg';
          
          if (type === 'user') setUserImage({ data: base64, mimeType });
          else if (type === 'outfit') setOutfitImage({ data: base64, mimeType });
          else if (type === 'studio') setStudioBaseImage({ data: base64, mimeType });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const generateStudioImage = async () => {
    if (!studioPrompt) return;

    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      if (!selected) {
        await handleSelectKey();
      }
    }

    setIsGenerating(true);
    setError(null);
    setResultImage(null);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: 'studio-generate',
          payload: {
            prompt: studioPrompt,
            baseImage: studioBaseImage
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      
      if (data.image) {
        setResultImage(`data:image/png;base64,${data.image}`);
      } else if (data.text) {
        // If it's just text, maybe it's a description
        setError("AI returned a description instead of an image. Try a more specific prompt.");
      } else {
        throw new Error("No image was generated. Please try a different prompt.");
      }

    } catch (err: any) {
      console.error("Studio error:", err);
      setError(err.message || "Failed to generate image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateOutfit = async () => {
    if (!userImage || !outfitImage) return;

    setIsGenerating(true);
    setError(null);
    setResultImage(null);
    setShoppingItems([]);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: 'try-on',
          payload: {
            userImage,
            outfitImage
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate virtual try-on");
      }

      const data = await response.json();
      
      if (data.image) {
        setResultImage(`data:image/png;base64,${data.image}`);
      }
      
      if (data.analysis && data.analysis.items) {
        setShoppingItems(data.analysis.items);
      }

    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate virtual try-on.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-1 glass-panel rounded-full text-[10px] uppercase tracking-[0.3em] font-space font-bold mb-6"
        >
          AI-POWERED CREATIVE SUITE
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-6xl md:text-8xl leading-none tracking-tighter uppercase"
        >
          STYLE <span className="text-stroke">SYNC</span>
        </motion.h1>
        
        {/* Tab Switcher */}
        <div className="mt-12 flex p-1 glass-panel rounded-full">
          <button 
            onClick={() => { setActiveTab('try-on'); setResultImage(null); setError(null); }}
            className={cn(
              "px-8 py-3 rounded-full font-space text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2",
              activeTab === 'try-on' ? "bg-brand-accent text-brand-black" : "text-white/40 hover:text-white"
            )}
          >
            <RefreshCw size={14} />
            Virtual Try-On
          </button>
          <button 
            onClick={() => { setActiveTab('studio'); setResultImage(null); setError(null); }}
            className={cn(
              "px-8 py-3 rounded-full font-space text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2",
              activeTab === 'studio' ? "bg-brand-accent text-brand-black" : "text-white/40 hover:text-white"
            )}
          >
            <Wand2 size={14} />
            AI Image Studio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Section: Controls */}
        <div className="space-y-8">
          {activeTab === 'try-on' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Image Upload */}
              <div className="space-y-4">
                <p className="font-space text-xs uppercase tracking-widest opacity-40 font-bold">1. Your Photo</p>
                <div 
                  onClick={() => userFileRef.current?.click()}
                  className={cn(
                    "aspect-[3/4] rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative group",
                    userImage && "border-solid border-brand-accent/50"
                  )}
                >
                  {userImage ? (
                    <>
                      <img src={`data:${userImage.mimeType};base64,${userImage.data}`} alt="User" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <RefreshCw className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Upload size={20} className="opacity-40" />
                      </div>
                      <p className="font-space text-[10px] uppercase tracking-widest opacity-40">Upload Portrait</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={userFileRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, 'user')} 
                  />
                </div>
              </div>

              {/* Outfit Image Upload */}
              <div className="space-y-4">
                <p className="font-space text-xs uppercase tracking-widest opacity-40 font-bold">2. The Outfit</p>
                <div 
                  onClick={() => outfitFileRef.current?.click()}
                  className={cn(
                    "aspect-[3/4] rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative group",
                    outfitImage && "border-solid border-brand-accent/50"
                  )}
                >
                  {outfitImage ? (
                    <>
                      <img src={`data:${outfitImage.mimeType};base64,${outfitImage.data}`} alt="Outfit" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <RefreshCw className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Upload size={20} className="opacity-40" />
                      </div>
                      <p className="font-space text-[10px] uppercase tracking-widest opacity-40">Upload Clothing</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={outfitFileRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, 'outfit')} 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="font-space text-xs uppercase tracking-widest opacity-40 font-bold">Describe your vision</p>
                <textarea 
                  value={studioPrompt}
                  onChange={(e) => setStudioPrompt(e.target.value)}
                  placeholder="A futuristic streetwear look with neon accents, cinematic lighting..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 font-space text-sm focus:outline-none focus:border-brand-accent/50 transition-all resize-none"
                />
              </div>

              <div className="space-y-4">
                <p className="font-space text-xs uppercase tracking-widest opacity-40 font-bold">Base Image (Optional)</p>
                <div 
                  onClick={() => studioFileRef.current?.click()}
                  className={cn(
                    "h-48 rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative group",
                    studioBaseImage && "border-solid border-brand-accent/50"
                  )}
                >
                  {studioBaseImage ? (
                    <>
                      <img src={`data:${studioBaseImage.mimeType};base64,${studioBaseImage.data}`} alt="Base" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <RefreshCw className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <ImageIcon size={20} className="opacity-40" />
                      </div>
                      <p className="font-space text-[10px] uppercase tracking-widest opacity-40">Upload Reference Image</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={studioFileRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, 'studio')} 
                  />
                </div>
              </div>
            </div>
          )}

          <button
            disabled={isGenerating || (activeTab === 'try-on' ? (!userImage || !outfitImage) : !studioPrompt)}
            onClick={activeTab === 'try-on' ? generateOutfit : generateStudioImage}
            className={cn(
              "w-full py-6 rounded-full font-space font-bold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all",
              (isGenerating || (activeTab === 'try-on' ? (!userImage || !outfitImage) : !studioPrompt))
                ? "bg-white/5 text-white/20 cursor-not-allowed"
                : "bg-brand-accent text-brand-black hover:scale-[1.02] active:scale-[0.98]" 
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {activeTab === 'try-on' ? "Processing Neural Layers..." : "Generating Vision..."}
              </>
            ) : (
              <>
                <Sparkles size={20} />
                {activeTab === 'try-on' ? "Generate Virtual Look" : "Create Masterpiece"}
              </>
            )}
          </button>

          {!hasApiKey && activeTab === 'studio' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 space-y-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="text-brand-accent shrink-0" size={20} />
                <div className="space-y-1">
                  <p className="font-display text-sm uppercase tracking-tight">Paid API Key Required</p>
                  <p className="font-space text-[10px] opacity-60 leading-relaxed">
                    The AI Image Studio uses advanced models that require a paid Gemini API key. 
                    Please select your key to continue.
                  </p>
                </div>
              </div>
              <button 
                onClick={handleSelectKey}
                className="w-full py-3 bg-brand-accent text-brand-black rounded-xl font-space font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Key size={14} />
                Select API Key
              </button>
            </motion.div>
          )}

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-red-500 font-space text-xs text-center"
            >
              {error}
            </motion.p>
          )}

          {/* Shop the Look Section */}
          <AnimatePresence>
            {shoppingItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-8 border-t border-white/10"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-brand-accent" size={20} />
                  <h3 className="font-display text-2xl uppercase tracking-tighter">Shop the Look</h3>
                </div>
                
                <div className="space-y-4">
                  {shoppingItems.map((item, idx) => (
                    <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-space text-[10px] uppercase tracking-widest opacity-40 mb-1">{item.category}</p>
                          <h4 className="font-display text-lg uppercase tracking-tight">{item.name}</h4>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {item.platforms.map((platform, pIdx) => (
                          <a
                            key={pIdx}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white/5 hover:bg-brand-accent hover:text-brand-black rounded-full text-[9px] font-space font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                          >
                            {platform.name} <ExternalLink size={10} />
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Result Section */}
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-white/5 border border-white/10">
          <AnimatePresence mode="wait">
            {resultImage ? (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative"
              >
                <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
                <div className="absolute bottom-6 left-6 right-6 p-6 glass-panel rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="font-display text-xl uppercase tracking-tighter">
                      {activeTab === 'try-on' ? "AI GENERATED LOOK" : "AI STUDIO CREATION"}
                    </h4>
                    <p className="font-space text-[10px] opacity-60 uppercase tracking-widest">
                      {activeTab === 'try-on' ? "StyleSync Neural Engine v2.5" : "Gemini 3.1 Visual Engine"}
                    </p>
                  </div>
                  {activeTab === 'try-on' && (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-brand-accent text-brand-black text-[8px] rounded font-bold uppercase tracking-widest">
                        Accessories Added
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center p-12 text-center"
              >
                {isGenerating ? (
                  <div className="space-y-6 flex flex-col items-center">
                    <div className="relative w-24 h-24">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-brand-accent border-t-transparent rounded-full"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border-2 border-white/20 border-b-transparent rounded-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="font-display text-2xl uppercase tracking-tighter">Synthesizing...</p>
                      <p className="font-space text-[10px] opacity-40 uppercase tracking-widest">
                        {activeTab === 'try-on' ? "Mapping body geometry & fabric physics" : "Dreaming in pixels & neural patterns"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8">
                      {activeTab === 'try-on' ? <Sparkles size={32} className="opacity-20" /> : <Wand2 size={32} className="opacity-20" />}
                    </div>
                    <h3 className="font-display text-3xl uppercase tracking-tighter mb-4">
                      {activeTab === 'try-on' ? "Ready to Transform" : "AI Image Studio"}
                    </h3>
                    <p className="font-space text-sm opacity-40 leading-relaxed">
                      {activeTab === 'try-on' 
                        ? "Upload your photos on the left to see the magic happen. The AI will automatically add matching accessories."
                        : "Describe the fashion look you want to create. You can also upload a base image to edit or use as reference."}
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
