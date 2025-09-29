import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import banner from "../assets/banner.png";

export default function FinalBanner() {
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-pacifico bg-pink-50 p-10">
      <motion.div
        className="w-full max-w-3xl p-10 bg-gradient-to-r from-pink-300 to-pink-500 rounded-3xl shadow-2xl text-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <h1 className="text-3xl font-bold mb-4 text-white">Happy Birthday Again!</h1>
       <img
  src={banner}
  alt="Banner"
  className="mx-auto mb-4 rounded-lg shadow w-48 h-auto"
/>

        <p className="text-white text-lg">
          Thank you for being the most wonderful person in my life. Every day with you is a gift, and I'm so grateful for all the love, laughter, and beautiful memories we share. You make my world brighter just by being in it!
        </p>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Happy+Monkey&display=swap');
        .font-pacifico { font-family: 'Pacifico', cursive;}`}</style>
    </div>
  );
}
