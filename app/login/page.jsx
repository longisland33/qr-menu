"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios"; 

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Next.js daxili API-ya sorğu
      const res = await api.post("/auth/login", formData);
      
      if (res.status === 200) {
        // Uğurlu girişdən sonra Middleware artıq cookie-ni (admin_session) tanıyacaq
        // Single-tenant olduğu üçün birbaşa admin panelinə yönləndiririk
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login xətası:", err);
      alert(err.response?.data?.error || "İstifadəçi adı və ya şifrə yanlışdır!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-8 uppercase text-center">
          ADMİN <span className="text-orange-500">PANEL</span>
        </h1>
        <div className="space-y-4">
          <input
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-orange-500 transition-all"
            placeholder="İstifadəçi adı"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-orange-500 transition-all"
            type="password"
            placeholder="Şifrə"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button 
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-600/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? "YOXLANILIR..." : "DAXİL OL"}
          </button>
        </div>
      </form>
    </div>
  );
}