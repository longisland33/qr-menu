"use client";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import api from "../../../lib/axios"; // Mərkəzi axios instansiyan

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("daily"); // daily / monthly
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Axios ilə sorğu: restaurantId-ni backend özü sessiyadan (req.user) tapa bilər,
        // ya da query kimi göndərə bilərsən.
        const res = await api.get(`/analytics?period=${period}`);
        setData(res.data);
      } catch (error) {
        console.error("Analitika yüklənmədi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-orange-500 font-bold animate-pulse">
      MƏLUMATLAR ANALİZ EDİLİR...
    </div>
  );

  if (!data) return (
    <div className="p-10 text-white text-center">Məlumat tapılmadı.</div>
  );

  const chartData = {
    labels: data.topProducts?.map(p => p.name) || [],
    datasets: [{
      label: 'Satış Sayı',
      data: data.topProducts?.map(p => p.qty) || [],
      backgroundColor: '#f97316',
      borderRadius: 10,
    }]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <h1 className="text-3xl font-black  uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
         Hesabat
        </h1>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
          <button 
            onClick={() => setPeriod("daily")}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${period === "daily" ? 'bg-orange-600 shadow-lg shadow-orange-600/20 text-white' : 'text-slate-400 hover:text-white'}`}
          >GÜNLÜK</button>
          <button 
            onClick={() => setPeriod("monthly")}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${period === "monthly" ? 'bg-orange-600 shadow-lg shadow-orange-600/20 text-white' : 'text-slate-400 hover:text-white'}`}
          >AYLIQ</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Ümumi Gəlir" value={`${data.totalRevenue?.toFixed(2)} AZN`} color="text-green-500" />
        <StatCard title="Sifariş Sayı" value={`${data.orderCount} Sifariş`} color="text-blue-500" />
        <StatCard title="Ortalama Çek" value={`${data.orderCount > 0 ? (data.totalRevenue / data.orderCount).toFixed(2) : "0.00"} AZN`} color="text-orange-500" />
      </div>

      <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold">Top 5 Məhsul</h3>
          <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 border border-slate-700 font-mono italic">
            {period === "daily" ? "Bugünkü trend" : "Aylıq trend"}
          </span>
        </div>
        <div className="h-[350px] md:h-[400px]">
          <Bar 
            data={chartData} 
            options={{ 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#64748b" } },
                x: { grid: { display: false }, ticks: { color: "#64748b" } }
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
}

// Kiçik Stat kartı komponenti (kodun təmizliyi üçün)
function StatCard({ title, value, color }) {
  return (
    <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-xl hover:border-slate-700 transition-colors group">
      <p className="text-slate-500 text-xs font-black uppercase mb-2 tracking-widest">{title}</p>
      <h2 className={`text-4xl font-black ${color} tracking-tighter group-hover:scale-105 transition-transform origin-left`}>
        {value}
      </h2>
    </div>
  );
}