import { motion } from "framer-motion";

export default function GameIntro({ onStart }) {
  return (
    <div
      className="h-screen flex flex-col items-center justify-center text-center px-6"
      style={{
        background: "linear-gradient(to top right, #ffd6e0, #e0f7fa, #fff3e0)",
      }}
    >
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Help Shashank Catch Hearts! 🐱💕
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-gray-700 max-w-lg mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Help my adorable baby catch <b>22 falling hearts</b> to unlock your
        birthday surprise! <br />
        Use <b>arrow keys</b> (desktop) or <b>touch & drag</b> (mobile).
      </motion.p>
      <motion.button
        onClick={onStart}
        className="bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg text-lg font-semibold hover:bg-pink-600"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Start Game 🎮
      </motion.button>
    </div>
  );
}

