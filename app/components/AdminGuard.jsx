"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingBag, LogOut, LayoutGrid } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

/**
 * Protects admin routes by verifying authentication status.
 * Redirects to login if not authenticated.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Protected admin layout or redirect
 */
export default function AdminGuard({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    /**
     * Checks if the user is authenticated by calling the /auth/me API.
     * Redirects to login if not authenticated.
     */
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.authenticated) {
          setIsAuth(true);
        } else {
          router.replace("/login");
        }
      } catch (err) {
        // Authentication failed, redirect to login
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  /**
   * Handles admin logout by calling the logout API and redirecting to login.
   * Displays a user-friendly error message if logout fails.
   */
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      router.replace("/login");
    } catch (error) {
      alert("Logout failed. Please try again.");
      router.replace("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-text dark:bg-black dark:text-zinc-100">
        <span className="animate-spin rounded-full border-4 border-zinc-700 border-t-primary h-12 w-12"></span>
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-text dark:bg-black dark:text-zinc-100">
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border p-6 dark:bg-zinc-900 dark:border-zinc-800">
        <nav className="flex flex-col gap-4">
          <Link
            href="/dashboard/products"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Products
          </Link>
          <Link
            href="/dashboard/categories"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <LayoutGrid className="w-5 h-5" />
            Categories
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-error/10 text-error transition-colors"
            type="button"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}