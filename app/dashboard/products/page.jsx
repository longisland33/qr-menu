"use client";
import { useState, useEffect } from "react";
import { Trash2, PackagePlus, Info } from "lucide-react"; // İkonlar üçün
import api from "../../../lib/axios";

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [form, setForm] = useState({
    name: "", price: "", description: "", categoryId: ""
  });

  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get("/categories"),
        api.get("/products")
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (error) {
      console.error("Məlumatlar yüklənərkən xəta:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // SİLMƏ FUNKSİYASI
  const deleteProduct = async (id) => {
    if (!confirm("Bu məhsulu birdəfəlik silmək istəyirsiniz?")) return;
    
    try {
      await api.delete(`/products?id=${id}`);
      setProducts(products.filter(p => (p._id || p.id) !== id)); // Siyahıdan dərhal çıxar
      alert("Məhsul və şəkli silindi.");
    } catch (error) {
      alert("Silinmə zamanı xəta baş verdi.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId) return alert("Kateqoriya seçin!");
    setLoading(true);
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("categoryId", form.categoryId);
    if (selectedFile) formData.append("image", selectedFile);

    try {
      const res = await api.post("/products", formData);
      if (res.status === 201 || res.status === 200) {
        setForm({ name: "", price: "", description: "", categoryId: "" });
        setSelectedFile(null);
        fetchData();
      }
    } catch (error) {
      alert("Xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Məhsul Paneli</h1>
            <p className="text-slate-500 mt-1 font-medium">Menyunu idarə edin.</p>
          </div>
          <div className="bg-orange-100 text-orange-700 px-6 py-2 rounded-2xl font-black text-sm shadow-sm border border-orange-200">
            {products.length} MƏHSUL
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* SOL TƏRƏF: FORM */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-8">
              <h2 className="text-xl font-black mb-6 text-slate-800 flex items-center gap-2">
                <PackagePlus className="text-orange-500" /> Yeni Məhsul
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                 {/* Inputların eyni qalır, dizaynı qorudum */}
                 <input 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    placeholder="Məhsul adı" required
                  />
                  <input 
                    type="file" accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-900 file:text-white cursor-pointer"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="number" step="0.01" value={form.price}
                      onChange={(e) => setForm({...form, price: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"
                      placeholder="Qiymət" required
                    />
                    <select 
                      value={form.categoryId}
                      onChange={(e) => setForm({...form, categoryId: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                      required
                    >
                      <option value="">Kateqoriya...</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <textarea 
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-24 resize-none outline-none"
                    placeholder="Açıqlama..."
                  />
                  <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-slate-900 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-200">
                    {loading ? "Yadda saxlanılır..." : "Yadda Saxla"}
                  </button>
              </form>
            </div>
          </div>

          {/* SAĞ TƏRƏF: SİYAHI */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-200 uppercase text-[11px] font-black tracking-widest">
                  <tr>
                    <th className="p-6">Məhsul Məlumatı</th>
                    <th className="p-6">Bölmə</th>
                    <th className="p-6 text-right">Qiymət & İdarə</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={p.image || "/no-image.png"} className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                          <div>
                            <div className="font-extrabold text-slate-800 text-lg">{p.name}</div>
                            <div className="text-sm text-slate-400 font-medium line-clamp-1">{p.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="bg-slate-100 text-slate-500 text-[10px] px-3 py-1.5 rounded-lg font-black border border-slate-200">
                          {p.category?.name}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-xl font-black text-slate-900">{Number(p.price).toFixed(2)} AZN</div>
                          <button 
                            onClick={() => deleteProduct(p.id)}
                            className="flex items-center gap-1 text-red-400 hover:text-red-600 font-bold text-xs p-2 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={14} /> Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}