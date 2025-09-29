import { motion } from "framer-motion";

export default function BirthdayCard({ onNext }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-pink-200 p-10 rounded-2xl shadow-xl text-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <h1 className="text-2xl font-bold mb-4">You get unlimited hugs, a million kisses, and a one-month subscription to the best girlfriend ever ❤️</h1>
        <button className="mt-4 px-4 py-2 bg-white rounded" onClick={onNext}>Next</button>
      </motion.div>
    </motion.div>
  );
}
