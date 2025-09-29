import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Import local image from src/assets folder
import boyfriendImg from "../assets/boyfriend.png";
import pop from "../assets/pop.mp3";

const TOTAL_HEARTS = 100;
const WIN_HEARTS = 22;
const MAX_ACTIVE = 30;

export default function HeartsGame({ onComplete }) {
  const [hearts, setHearts] = useState([]);
  const [score, setScore] = useState(0);
  const [kittenX, setKittenX] = useState(50);
  const [caughtHearts, setCaughtHearts] = useState([]);

  // Gradually spawn hearts
  useEffect(() => {
    let spawned = 0;
    const interval = setInterval(() => {
      if (spawned < TOTAL_HEARTS) {
        setHearts((prev) => [
          ...prev.slice(-MAX_ACTIVE + 1), // keep max 30
          {
            id: Math.random(),
            x: Math.random() * 90,
            y: -10,
            speed: 0.5 + Math.random() * 0.5, // slower fall
          },
        ]);
        spawned++;
      } else {
        clearInterval(interval);
      }
    }, 800); // new heart every 0.8s
    return () => clearInterval(interval);
  }, []);

  // Move hearts + detect collision
  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) =>
        prev.map((h) => {
          const newY = h.y + h.speed;

          // Collision with kitten catcher
          if (
            newY > 85 &&
            newY < 95 &&
            Math.abs(h.x - kittenX) < 5 &&
            !caughtHearts.includes(h.id)
          ) {
            setScore((s) => s + 2);
            setCaughtHearts((prevIds) => [...prevIds, h.id]);

            // 🎊 Confetti burst at heart position
            confetti({
              particleCount: 20,
              spread: 40,
              origin: { x: h.x / 100, y: newY / 100 },
            });

            // Small pop sound
            const popSound = new Audio(pop);
            popSound.play();

            return { ...h, y: 200 }; // mark as off-screen
          }

          // If heart goes off-screen, move it out of play
          if (newY > 110) return { ...h, y: 200 };

          return { ...h, y: newY };
        })
      );
    }, 30); // smoother falling
    return () => clearInterval(interval);
  }, [kittenX, caughtHearts]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") setKittenX((x) => Math.max(0, x - 5));
      if (e.key === "ArrowRight") setKittenX((x) => Math.min(90, x + 5));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Touch drag (mobile)
  const handleTouchMove = (e) => {
    const touchX = e.touches[0].clientX;
    const percent = (touchX / window.innerWidth) * 100;
    setKittenX(percent);
  };

  // Win condition
  useEffect(() => {
    if (score >= WIN_HEARTS) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setTimeout(onComplete, 1000);
    }
  }, [score, onComplete]);

  return (
    <div
      className="relative h-screen overflow-hidden"
      onTouchMove={handleTouchMove}
      style={{
        background: "linear-gradient(to top, #ffe0f0, #fffae0)",
        backgroundImage: "url('/clouds.png')",
        backgroundSize: "cover",
      }}
    >
      {/* Scoreboard */}
      <div className="absolute top-4 left-4 text-xl font-bold text-pink-600">
        Hearts: {score}/{WIN_HEARTS}
      </div>

      {/* Falling hearts */}
      <AnimatePresence>
        {hearts
          .filter((h) => h.y < 150) // don't render removed hearts
          .map((h) => (
            <motion.div
              key={h.id}
              className="absolute text-red-500 text-3xl"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              ❤️
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Boyfriend catcher */}
      <div
        className="absolute bottom-4 w-20 h-20 rounded-full shadow-lg overflow-hidden border-2 border-pink-400"
        style={{ left: `${kittenX}%`, transform: "translateX(-50%)" }}
      >
        <img
          src={boyfriendImg}
          alt="Boyfriend"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
    </div>
  );
}







// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// export default function HeartsGame({ onComplete }) {
//   const [score, setScore] = useState(0);

//   const catchHeart = () => {
//     if (score < 22) {
//       setScore(score + 1);
//       // Play kiss sound effect here
//     }
//   };

//   useEffect(() => {
//     if (score >= 22) {
//       onComplete();
//     }
//   }, [score]);

//   return (
//     <div className="relative h-screen bg-pink-100 overflow-hidden">
//       <div className="absolute top-4 left-4 text-xl font-bold">
//         Hearts: {score}/22
//       </div>
//       <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center">
//         🐱
//       </div>
//       {/* Add hearts falling animation here */}
//       <button className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-white rounded" onClick={catchHeart}>Catch Heart</button>
//     </div>
//   );
// }
