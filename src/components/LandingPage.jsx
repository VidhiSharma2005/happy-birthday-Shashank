import { useState, useEffect } from "react";

const helloKittyGif = "https://i.pinimg.com/originals/c5/24/8e/c5248ed334ed6965c2167910024da02d.gif";
const cornerGif = "https://i.pinimg.com/originals/e6/8e/0f/e68e0f918dc5dd750f4522ec1671e3c6.gif";
const planeGif = "src/assets/pengu-pudgy-unscreen.gif";
const closedEnvelope = "src/assets/closedenvelope.png";
const openEnvelope = "src/assets/open.png";

export default function LandingPage({ onContinue }) {
  const [stage, setStage] = useState("hello"); // hello, plane, envelope-closed, envelope-open, letter

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setStage("plane"), 1800));
    timers.push(setTimeout(() => setStage("envelope-closed"), 3700));
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleOpenEnvelope = () => {
  setStage("letter");
};


  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden font-pacifico select-none">
      {/* Hello Kitty GIF */}
      <div
        className={`transition-opacity duration-700 absolute bottom-44 left-1/2 transform -translate-x-1/2 pointer-events-none select-none flex flex-col items-center ${
          stage === "hello" ? "opacity-100 z-20" : "opacity-0 pointer-events-none z-0"
        }`}
        aria-label="Hello Kitty waving"
      >
        <img
          src={helloKittyGif}
          alt="Waving Hello Kitty"
          style={{ width: "auto", height: "150px" }}
          draggable={false}
          className="drop-shadow-lg"
        />
        <p className="mt-4 text-3xl text-pink-700 text-center font-bold drop-shadow-xl">
          I've got a surprise for you.
        </p>
      </div>

      {/* Plane GIF */}
      {stage === "plane" && (
        <img
          src={planeGif}
          alt="Flying paper plane"
          style={{ left: 0, top: 0, animationFillMode: "forwards" }}
          className="absolute z-30 w-[150px] h-[120px] animate-planefly pointer-events-none"
          draggable={false}
        />
      )}

      {/* Closed Envelope with larger top-right gif */}
      {stage === "envelope-closed" && (
        <div className="relative z-30 flex flex-col items-center">
          <img
            src={closedEnvelope}
            alt="Closed envelope"
            className="w-[410px] h-[320px] md:w-[600px] md:h-[400px] transition-transform duration-400 hover:scale-105 cursor-pointer shadow-2xl border-4 border-pink-400 rounded-3xl"
            onClick={handleOpenEnvelope}
            draggable={false}
          />
          {/* Larger top-right GIF */}
          <img
            src={cornerGif}
            alt="Animated corner gif"
            className={`absolute top-[10px] right-[20px] w-20 h-20 rounded-full pointer-events-none select-none transition-opacity duration-500 ${
              stage === "envelope-open" ? "opacity-0" : "opacity-90"
            }`}
            draggable={false}
          />
          <button
            onClick={handleOpenEnvelope}
            className="mt-8 bg-pink-100 text-pink-900 border-2 border-pink-300 rounded-full px-8 py-4 font-bold text-xl shadow transition hover:bg-pink-200"
          >
            Click to Open
          </button>
        </div>
      )}

      {/* Envelope open */}
      {/* {stage === "envelope-open" && (
        <div className="absolute top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-envelopeopen">
          <img
            src={openEnvelope}
            alt="Open envelope"
            className="w-[410px] h-[400px] md:w-[530px] md:h-[500px] shadow-2xl border-4 border-pink-400 rounded-3xl"
            draggable={false}
          />
        </div>
      )} */}

      {/* Letter Modal with Continue button */}
      {stage === "letter" && (
        <div
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-50"
          onClick={() => setStage("envelope-closed")}
          tabIndex={-1}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-white rounded-xl p-8 shadow-xl text-center relative"
            role="document"
          >
            <button
              onClick={() => setStage("envelope-closed")}
              aria-label="Close letter"
              className="absolute top-4 right-4 text-pink-500 text-3xl font-bold hover:text-pink-700 transition"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-4 text-pink-600 select-text">A special letter for you 💌</h2>
            <p className="text-gray-700 text-lg select-text mb-6">
              Thank you for being such an amazing part of my life. I hope this little surprise brings a smile to your face and makes you feel happy! I love you baby.🎀💕
            </p>
            <button
              onClick={() => onContinue && onContinue()}
              className="bg-pink-400 text-white px-8 py-3 font-semibold rounded-full shadow hover:bg-pink-500 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Happy+Monkey&display=swap');
        .font-pacifico { font-family: 'Pacifico', cursive;}
        @keyframes planefly {
          0%   { left: 0; top: 0; opacity: 1; }
          80%  { left: 55vw; top: 45vh; opacity: 1; }
          100% { left: 50vw; top: 50vh; opacity: 0; }
        }
        .animate-planefly { animation: planefly 2s cubic-bezier(.8,.2,.2,1) forwards;}
        @keyframes envelopeopen {
          0% { transform: scale(0.95) translate(-50%, -50%); opacity: 0.6; }
          100% { transform: scale(1) translate(-50%, -50%); opacity: 1; }
        }
        .animate-envelopeopen { animation: envelopeopen 0.7s cubic-bezier(.7,1.1,.9,1) forwards;}
      `}</style>
    </div>
  );
}
// import { motion } from "framer-motion";

// export default function LandingPage({ onStart }) {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <motion.div
//         animate={{ x: [0, 200, 0], rotate: [0, 15, -15, 0] }}
//         transition={{ duration: 3, repeat: Infinity }}
//         className="relative"
//       >
//         {/* Airplane */}
//         <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center">
//           ✈️
//         </div>
//         {/* Hello Kitty */}
//         <div className="absolute -top-4 left-12 w-8 h-8">
//           🐱
//         </div>
//       </motion.div>
//       <motion.div
//         className="mt-10 w-48 h-32 bg-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer"
//         whileHover={{ scale: 1.1 }}
//         onClick={onStart}
//       >
//         <span className="text-lg font-semibold">Surprise for you 💌</span>
//       </motion.div>
//     </div>
//   );
// }
