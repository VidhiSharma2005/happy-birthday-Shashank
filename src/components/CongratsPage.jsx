import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";

// Import local image from src/assets
import congratsImg from "../assets/Congrats.png";

export default function CongratsPage({ onNext }) {
  useEffect(() => {
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
  }, []);

  return (
    <div
      className="h-screen flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(to top right, #ffe0f0, #fff0f5, #e0f7fa)",
      }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md relative"
        initial={{ rotateY: 90 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 1 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <h2 className="text-2xl font-bold text-pink-600 mb-4">
          🎉 Congratulations on turning 22! 🎉
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          You get unlimited hugs, a million kisses, and a one-month subscription to the
          <b> best girlfriend ever ❤️</b>
        </p>

        {/* Placeholder image spot */}
        <div className="mt-4 mb-6">
          <img
            src={congratsImg}
            alt="Surprise"
            className="mx-auto rounded-lg shadow-md w-48 h-48 object-cover"
          />
        </div>

        <button
          onClick={onNext}
          className="bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg text-lg font-semibold hover:bg-pink-600"
        >
          Continue 🎂
        </button>
      </motion.div>
    </div>
  );
}


