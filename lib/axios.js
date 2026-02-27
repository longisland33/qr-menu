import axios from "axios";

const api = axios.create({
  // NEXT_PUBLIC_API_URL .env faylından gəlir (məs: http://localhost:3000)
  // Əgər boşdursa, nisbi yoldan (/api/...) istifadə edir
  baseURL: process.env.NEXT_PUBLIC_API_URL || "", 
  
  // BU ÇOX VACİBDİR: Middleware-in admini tanıması üçün 
  // brauzerdəki cookie-ləri (admin_session) hər sorğu ilə bərabər göndərir.
  withCredentials: true, 
  
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Xətaları qlobal şəkildə idarə etmək üçün
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Əgər server 401 (Yetkisiz) qaytararsa
    if (error.response?.status === 401) {
      console.warn("Yetkisiz giriş cəhdi - Login səhifəsinə yönləndirilə bilər.");
      // İstəsən burada window.location.href = "/login" edə bilərsən
    }
    return Promise.reject(error);
  }
);

export default api;