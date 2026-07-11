"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfoStr = localStorage.getItem("userInfo");

    if (!userInfoStr) {
      router.replace("/login");
      return;
    }

    const userInfo = JSON.parse(userInfoStr);

    // admin check
    if (adminOnly && userInfo.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    setLoading(false);
  }, [router, adminOnly]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  return children;
}