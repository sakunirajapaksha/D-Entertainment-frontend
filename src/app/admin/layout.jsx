"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import { LogOut, LayoutDashboard, Calendar, Clock, CreditCard, Image } from "lucide-react";

const handleLogout = () => {
  localStorage.removeItem("userInfo");
  window.location.href = "/login";
};

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    { href: "/admin/availability", label: "Availability", icon: Clock },
    { href: "/admin/payments", label: "Payments", icon: CreditCard },
    { href: "/admin/gallery", label: "Gallery", icon: Image },
  ];

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen flex bg-white text-gray-800">
        {/* SIDEBAR - Light theme */}
        <aside className="w-64 bg-gray-50 border-r border-gray-200 p-6 shadow-sm">
          <div className="mb-10">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#E11D48] to-[#FBBF24] bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-400 mt-1">D Entertainment</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;  
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#E11D48]/10 text-[#E11D48] font-medium border-l-4 border-[#E11D48]"
                      : "text-gray-600 hover:bg-gray-100 hover:text-[#E11D48]"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-10 w-full bg-gradient-to-r from-[#E11D48] to-[#B91C1C] hover:from-[#FBBF24] hover:to-[#E11D48] transition-all text-white font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md"
          >
            <LogOut size={18} /> Logout
          </button>
        </aside>

        {/* MAIN CONTENT - White background */}
        <main className="flex-1 p-8 bg-white overflow-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}             
 

  










