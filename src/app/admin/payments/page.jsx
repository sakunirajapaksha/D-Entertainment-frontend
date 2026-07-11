"use client";

import { motion } from "framer-motion";
import { Users, Wallet, CheckCircle, Clock } from "lucide-react";

export default function PaymentsPage() {
  // Mock data – replace with API call when backend ready
  const payments = [
    { id: 1, client: "Nisansala Perera", amount: 25000, status: "Paid", date: "2026-07-12" },
    { id: 2, client: "Kasun Bandara", amount: 40000, status: "Pending", date: "2026-07-01" },
    { id: 3, client: "Dinuka Jayawardena", amount: 15000, status: "Paid", date: "2026-06-30" },
    { id: 4, client: "Tharushi Silva", amount: 35000, status: "Pending", date: "2026-06-22" },
  ];

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const formatAmount = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#E11D48] to-[#FBBF24] bg-clip-text text-transparent">
            Payment Management
          </h1>
          <p className="text-gray-500 mt-1">Track and manage client payments</p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#E11D48] to-[#FBBF24] mt-2 rounded-full" />
        </motion.div>

        {/* Summary Cards (optional) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-[#E11D48]/10 rounded-full">
              <Wallet size={24} className="text-[#E11D48]" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatAmount(payments.reduce((sum, p) => sum + p.amount, 0))}
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-[#FBBF24]/10 rounded-full">
              <Users size={24} className="text-[#FBBF24]" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Payments</p>
              <p className="text-2xl font-bold text-gray-800">{payments.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Payments List */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {payments.map((payment) => (
            <motion.div
              key={payment.id}
              variants={fadeUp}
              whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#E11D48]" />
                    <span className="font-semibold text-gray-800">{payment.client}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">{payment.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-[#E11D48]">
                    {formatAmount(payment.amount)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      payment.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status === "Paid" ? (
                      <CheckCircle size={12} />
                    ) : (
                      <Clock size={12} />
                    )}
                    {payment.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {payments.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
            <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No payment records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}