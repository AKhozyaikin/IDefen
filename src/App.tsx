
import React, { useState, useRef, useMemo } from 'react';
import { ObfuscationEngine } from './services/obfuscationEngine';
import { Download, Image as ImageIcon, Shield, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const App: React.FC = () => {
  const engine = useMemo(() => new ObfuscationEngine(), []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const levels = [
    { id: 1, name: "CNN Deception", desc: "Targeted noise to confuse neural network filters." },
    { id: 2, name: "Pixelation", desc: "Classic pixel-based obfuscation to hide details." },
    { id: 3, name: "Hybrid Guard", desc: "Maximum protection combining noise and pixelation." }
  ];

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (file.type !== 'image/png') {
      alert('Only PNG files are supported in Lite version.');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setStatus('idle');
  };

  const processImage = async () => {
    if (!selectedFile) return;
    setStatus('processing');
    try {
      const res = await engine.process(selectedFile, level);
      setResultUrl(res);
      setStatus('completed');
    } catch (err) {
      alert('Processing failed');
      setStatus('idle');
    }
  };

  const clear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setStatus('idle');
  };

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col items-center max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          IDefender Lite
        </h1>
        <p className="text-zinc-500 text-lg">Simplified local image privacy tool. PNG only.</p>
      </header>

      <main className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`h-64 rounded-3xl border-2 border-dashed glass-panel flex flex-col items-center justify-center cursor-pointer transition-all ${selectedFile ? 'border-zinc-700' : 'border-zinc-800 hover:border-zinc-600'}`}
          >
            {previewUrl ? (
              <img src={previewUrl} className="h-full w-full object-contain p-4 rounded-3xl" alt="Preview" />
            ) : (
              <div className="text-center p-6">
                <ImageIcon className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Drop PNG here</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={(e) => handleFiles(e.target.files)} className="hidden" accept="image/png" />
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-6">
            <div className="space-y-4">
              {levels.map((l) => (
                <button 
                  key={l.id} 
                  onClick={() => setLevel(l.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${level === l.id ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700'}`}
                >
                  <p className="font-black uppercase text-xs tracking-widest mb-1">{l.name}</p>
                  <p className="text-[10px] opacity-70 leading-tight">{l.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={processImage} 
              disabled={!selectedFile || status === 'processing'}
              className="flex-1 bg-white text-black font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              {status === 'processing' ? 'Processing...' : 'Protect'}
            </button>
            {selectedFile && (
              <button onClick={clear} className="p-4 glass-panel rounded-2xl text-zinc-500 hover:text-red-500 transition-colors">
                <Trash2 className="w-6 h-6" />
              </button>
            )}
          </div>
        </section>

        <section className="glass-panel rounded-3xl p-6 min-h-[400px] flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {status === 'completed' && resultUrl ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex-1 flex flex-col"
              >
                <div className="flex-1 relative mb-6">
                  <img src={resultUrl} className="w-full h-full object-contain rounded-xl" alt="Result" />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/20 text-green-500 text-[8px] font-black rounded-full border border-green-500/50 backdrop-blur-md">
                    SECURED
                  </div>
                </div>
                <a 
                  href={resultUrl} 
                  download={`secured_${selectedFile?.name}`}
                  className="w-full bg-zinc-800 text-white text-center py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PNG
                </a>
              </motion.div>
            ) : (
              <div className="m-auto text-center opacity-20">
                <Shield className="w-16 h-16 mx-auto mb-4" />
                <p className="font-black uppercase tracking-[0.3em] text-sm">Preview</p>
              </div>
            )}
          </AnimatePresence>
          
          {status === 'processing' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </section>
      </main>

      <footer className="mt-12 text-center text-zinc-600">
        <p className="text-[10px] font-black uppercase tracking-widest">IDefender Lite • Local Processing Only</p>
      </footer>
    </div>
  );
};

export default App;
