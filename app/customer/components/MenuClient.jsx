"use client";
import { useState, useEffect } from "react"; // useEffect eklendi
import { useCart } from "../../store/useCart";
import { motion } from "framer-motion";

export default function MenuClient() {
  const [categories, setCategories] = useState([]); // Veri için state
  const [loading, setLoading] = useState(true);    // Yüklenme durumu

  useEffect(() => {
    // API'ye istek atan fonksiyon
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories"); // API rotan hangisiyse (örn: /api/categories)
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Kategoriler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Yükleniyor animasyonu/ekranı
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFCFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FDFCFB] pb-32 font-sans selection:bg-orange-100">
      {/* Header */}
      <div className="relative h-48 bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img 
          src="https://t4.ftcdn.net/jpg/05/30/63/47/360_F_530634745_JTqtCiOWatBxCvRBVODE8k1In6hNWd6q.jpg" 
          className="w-full h-full object-cover opacity-60 scale-105"
          alt="Restaurant Header"
        />
        <div className="absolute bottom-6  z-20 w-full">
          <h1 className="text-white text-3xl font-bold tracking-tight uppercase text-center w-full">CR7 <br></br> <span className="text-blue-400">PLAYSTATION  KLUB</span> <br></br> MENU</h1>
        </div>
      </div>

      <div className="px-5 py-8 space-y-12">
        {categories.length === 0 ? (
          <p className="text-center text-neutral-500">Kategori tapılmadı.</p>
        ) : (
          categories.map((cat, catIdx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1 }}
              key={cat.id} 
              className="space-y-5"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  {cat.name}
                </h2>
              </div>

              <div className="grid gap-6">
                {cat.products.length === 0 ? (
                  <p className="text-center text-neutral-500">Bu kategoriyada məhsul yoxdur.</p>
                ) : (
                  cat.products.map((product) => (
                    <div key={product.id} className="relative bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0">
                        <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-neutral-800">{product.name}</h3>
                        <p className="text-neutral-400 text-xs line-clamp-1">{product.description}</p>
                        <p className="text-neutral-900 font-extrabold mt-2">{product.price.toFixed(2)} AZN</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}