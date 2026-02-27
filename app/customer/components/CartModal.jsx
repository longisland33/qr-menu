"use client";
import { useState } from "react";
import { useCart } from "../../store/useCart";
import api from "../../lib/axios"; // Lib içindəki axios instance

export default function CartModal({ isOpen, onClose, tableId }) { // restaurantId-ni sildik
  const { cart, clearCart } = useCart();
  const [notes, setNotes] = useState({});
  const [isOrdering, setIsOrdering] = useState(false);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (!isOpen) return null;

  const handleOrder = async () => {
    if (cart.length === 0 || isOrdering) return;

    setIsOrdering(true);

    const itemsWithNotes = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
      note: notes[item.id] || "", 
    }));

    try {
      // Next.js API yoluna ( /api/orders ) POST atırıq
      // Single-tenant üçün restaurantId parametrini sildik
      const res = await api.post("/api/orders", {
        tableNo: tableId,
        items: itemsWithNotes,
        total: totalPrice,
      });

      if (res.status === 200 || res.status === 201) {
        alert("Sifarişiniz mətbəxə göndərildi! ✅");
        clearCart();
        setNotes({});
        onClose();
      }
    } catch (err) {
      console.error("Order error:", err);
      // Middleware və ya API-dən gələn mesajı göstəririk
      const errorMessage = err.response?.data?.error || "Sistem xətası baş verdi.";
      alert(errorMessage);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    // ... TASARIMIN EYNƏN QALIR ...
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-end animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white w-full rounded-t-[32px] p-6 relative z-10 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800 tracking-tighter">Səbətim</h2>
          <button onClick={onClose} className="bg-gray-100 p-2 rounded-full w-10 h-10 font-bold hover:bg-gray-200 transition">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-1">
          {cart.length === 0 ? (
            <div className="text-center py-10 text-gray-400 font-medium italic">Səbətiniz boşdur 🥣</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{item.qty} ədəd x {item.price.toFixed(2)} AZN</p>
                  </div>
                  <div className="text-right font-black text-orange-600 tracking-tight">
                    {(item.qty * item.price).toFixed(2)} AZN
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={notes[item.id] || ""}
                    onChange={(e) => setNotes({ ...notes, [item.id]: e.target.value })}
                    placeholder="Xüsusi istək: (məs: soğan olmasın, acısız)"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-700 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all italic"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">✏️</span>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center px-2">
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Ümumi Məbləğ</span>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">{totalPrice.toFixed(2)} AZN</span>
            </div>

            <button
              onClick={handleOrder}
              disabled={isOrdering}
              className={`w-full ${isOrdering ? 'bg-gray-400' : 'bg-orange-600 shadow-orange-600/20'} text-white font-black py-5 rounded-2xl text-xl shadow-xl active:scale-[0.98] transition-all`}
            >
              {isOrdering ? "GÖNDƏRİLİR..." : "SİFARİŞİ VER 🚀"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}