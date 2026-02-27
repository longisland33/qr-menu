// app/[restaurant]/dashboard/layout.jsx
import AdminGuard from "../components/AdminGuard";

export default function AdminLayout({ children }) {
  return <AdminGuard>{children}</AdminGuard>;
}