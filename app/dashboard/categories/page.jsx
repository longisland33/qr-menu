"use client";
import { useState, useEffect } from "react";
import { Plus, ListTree, Trash2, Tag } from "lucide-react";
import api from "../../../lib/axios";

export default function CategoriesPage() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories"); 
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Kateqoriyalar yüklənmədi:", e);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.post("/categories", { name });
      if (res.status === 201 || res.status === 200) {
        setName("");
        fetchCategories();
      }
    } catch (e) {
      const errorMsg = e.response?.data?.error || "Xəta baş verdi";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Bu kateqoriyanı silmək istəyirsiniz?")) return;
    try {
      await api.delete(`/categories?id=${id}`);
      fetchCategories();
    } catch (e) {
      alert("Silinmə xətası: Kateqoriya boş olmalıdır.");
    }
  };

  useEffect(() => { 
    fetchCategories(); 
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        
        {/* BAŞLIQ HİSSƏSİ */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Tag className="text-orange-500 w-8 h-8" />
              Kateqoriyalar
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Menyu bölmələrini buradan idarə edin.</p>
          </div>
          <div className="hidden md:block bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm text-slate-600 font-bold text-sm">
            Cəmi: <span className="text-orange-600">{categories.length}</span> Bölmə
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          
          {/* YENİ KATEQORİYA ƏLAVƏ ETMƏ - PREMIUM CARD */}
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-200/50">
            <h2 className="text-sm font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">Yeni Bölmə Yarat</h2>
            <form onSubmit={addCategory} className="flex flex-col sm:flex-row gap-4">
              <input 
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Məs: İçkilər və ya Desertlər"
                className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-slate-900 font-medium placeholder:text-slate-400" 
                required
              />
              <button 
                disabled={loading}
                className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl text-base font-black transition-all active:scale-95 disabled:bg-slate-300 shadow-lg shadow-slate-200"
              >
                <Plus className="w-5 h-5" />
                {loading ? "Gözləyin..." : "Əlavə Et"}
              </button>
            </form>
          </div>

          {/* KATEQORİYA SİYAHISI - MODERN LIST */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
            <div className="px-8 py-5 border-b border-slate-50 bg-slate-900 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Mövcud Siyahı</h2>
              <ListTree className="w-5 h-5 text-orange-500" />
            </div>
            
            <div className="divide-y divide-slate-50">
              {categories.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <ListTree className="w-10 h-10 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold italic">Hələ heç bir kateqoriya yaradılmayıb.</p>
                </div>
              ) : (
                categories.map((cat) => (
                  <div 
                    key={cat.id} 
                    className="px-8 py-6 flex items-center justify-between group hover:bg-orange-50/30 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-black">
                        {cat.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800 text-lg group-hover:text-orange-600 transition-colors">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono tracking-widest mt-0.5">DB_ID: {cat.id}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => deleteCategory(cat.id)}
                      className="p-3 text-slate-300 hover:text-white hover:bg-red-500 rounded-2xl transition-all shadow-sm hover:shadow-red-200 group-hover:opacity-100 md:opacity-0"
                      title="Kateqoriyanı sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}