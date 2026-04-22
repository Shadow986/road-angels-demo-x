import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function StickyWhatsApp() {
  const phoneNumber = "27604807393"; // Your verified number
  const message = encodeURIComponent("Hello Road Angels RSA, I require engineering assistance.");

  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[9999] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-all"
    >
      <MessageCircle size={28} fill="currentColor" />
      
      {/* Subtle Ping Animation to draw the eye without being intrusive */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none"></span>
    </motion.a>
  );
}