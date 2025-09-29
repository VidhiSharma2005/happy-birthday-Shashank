import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CakeSection({ onNext }) {
  const [flameVisible, setFlameVisible] = useState(true);
  const [messageVisible, setMessageVisible] = useState(false);
  const [flicker, setFlicker] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  const startMicDetection = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        sourceRef.current =
          audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);

        analyserRef.current.fftSize = 512;

        const buffer = new Uint8Array(analyserRef.current.fftSize);

        const checkSound = () => {
          if (!flameVisible) return;

          analyserRef.current.getByteTimeDomainData(buffer);

          let sum = 0;
          for (let i = 0; i < buffer.length; i++) {
            sum += Math.abs(buffer[i] - 128);
          }
          const volume = sum / buffer.length;
          console.log("Volume:", volume);

          if (volume > 0.5) {
            setFlicker(true);
            setTimeout(() => blowCandle(), 500);
          } else {
            setFlicker(false);
          }

          requestAnimationFrame(checkSound);
        };

        checkSound();
      })
      .catch((err) => console.log("Mic access denied or error:", err));
  };

  const blowCandle = () => {
    setFlameVisible(false);
    setFlicker(false);
    setTimeout(() => setMessageVisible(true), 500);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4 text-center bg-gradient-to-t from-pink-50 to-yellow-50">
      <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-10">
        🎂 Make a Wish!
      </h1>

      {/* Cake container */}
      <div className="relative w-64 md:w-80 flex flex-col items-center">
        {/* Candle */}
        <div className="relative w-3 h-16 bg-yellow-300 rounded-full flex flex-col items-center justify-start">
          <AnimatePresence>
            {flameVisible && (
              <motion.div
                key="flame"
                className="w-3 h-6 bg-gradient-to-t from-yellow-400 to-red-500 rounded-full absolute -top-6 shadow-lg"
                animate={{
                  y: flicker ? [0, -8, 0] : [0, -5, 0],
                  scale: flicker ? [1, 1.3, 1] : [1, 1.2, 1],
                }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Tier 3 - Top */}
        <motion.div
          className="bg-pink-200 w-1/2 h-12 rounded-t-3xl relative shadow-sm flex items-center justify-center mt-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />

        {/* Tier 2 - Middle */}
        <motion.div
          className="bg-pink-300 w-5/6 h-16 rounded-t-3xl mb-1 relative shadow-md flex items-center justify-center mt-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src="https://media.tenor.com/3nT-5pb890wAAAAj/sparkle.gif"
            alt="sparkle"
            className="absolute w-12 h-12 -top-3 left-4"
          />
        </motion.div>

        {/* Tier 1 - Bottom */}
        <motion.div
          className="bg-pink-400 w-full h-20 rounded-t-3xl mb-1 relative shadow-lg flex items-center justify-center mt-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="https://media.tenor.com/3nT-5pb890wAAAAj/sparkle.gif"
            alt="sparkle"
            className="absolute w-12 h-12 -top-4 right-4"
          />
        </motion.div>
      </div>

      {/* Buttons */}
      {flameVisible && (
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={startMicDetection}
            className="bg-blue-400 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-500"
          >
            Blow Into Mic 🎤
          </button>
          <button
            onClick={blowCandle}
            className="bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-600"
          >
            Blow Candle 🎉
          </button>
        </div>
      )}

      {/* Message popup */}
      {messageVisible && (
        <motion.div
          className="mt-6 p-6 bg-white rounded-2xl shadow-2xl max-w-md text-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-lg">
            I wish you all the happiness in the world. <br />
            May all your 11:11 wishes come true. <br />
            Let's make beautiful memories together. <br />
            Sending you loads of kisses. <br />
            <b>Happy birthday, my moon. 🌙❤️</b>
          </p>
          <button
            onClick={onNext}
            className="mt-2 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-600"
          >
            Continue 💖
          </button>
        </motion.div>
      )}
    </div>
  );
}



// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function CakeSection({ onNext }) {
//   const [flameVisible, setFlameVisible] = useState(true);
//   const [messageVisible, setMessageVisible] = useState(false);
//   const [flicker, setFlicker] = useState(false);
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const dataArrayRef = useRef(null);
//   const sourceRef = useRef(null);

//   const startMicDetection = () => {
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//         analyserRef.current = audioContextRef.current.createAnalyser();
//         sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
//         sourceRef.current.connect(analyserRef.current);
//         analyserRef.current.fftSize = 256;
//         const bufferLength = analyserRef.current.frequencyBinCount;
//         dataArrayRef.current = new Uint8Array(bufferLength);

//         const checkSound = () => {
//           if (!flameVisible) return;
//           analyserRef.current.getByteFrequencyData(dataArrayRef.current);
//           const sum = dataArrayRef.current.reduce((a, b) => a + b, 0);
//           if (sum > 1000) {
//             setFlicker(true);
//             setTimeout(() => blowCandle(), 500); // slight delay for flicker
//           } else {
//             setFlicker(false);
//           }
//           requestAnimationFrame(checkSound);
//         };
//         checkSound();
//       })
//       .catch((err) => console.log("Mic access denied or error:", err));
//   };

//   const blowCandle = () => {
//     setFlameVisible(false);
//     setFlicker(false);
//     setTimeout(() => setMessageVisible(true), 500);
//   };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center px-4 text-center bg-gradient-to-t from-pink-50 to-yellow-50">
//       <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-10">🎂 Make a Wish!</h1>

//       {/* Cake container */}
//       <div className="relative w-64 md:w-80 flex flex-col items-center">

//         {/* Candle */}
//         <div className="relative w-3 h-16 bg-yellow-300 rounded-full flex flex-col items-center justify-start">
//           <AnimatePresence>
//             {flameVisible && (
//               <motion.div
//                 key="flame"
//                 className="w-3 h-6 bg-gradient-to-t from-yellow-400 to-red-500 rounded-full absolute -top-6 shadow-lg"
//                 animate={{
//                   y: flicker ? [0, -8, 0] : [0, -5, 0],
//                   scale: flicker ? [1, 1.3, 1] : [1, 1.2, 1],
//                 }}
//                 transition={{ repeat: Infinity, duration: 0.5 }}
//               />
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Tier 3 - Top */}
//         <motion.div
//           className="bg-pink-200 w-1/2 h-12 rounded-t-3xl relative shadow-sm flex items-center justify-center mt-2"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//         />

//         {/* Tier 2 - Middle */}
//         <motion.div
//           className="bg-pink-300 w-5/6 h-16 rounded-t-3xl mb-1 relative shadow-md flex items-center justify-center mt-1"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <img
//             src="https://media.tenor.com/3nT-5pb890wAAAAj/sparkle.gif"
//             alt="sparkle"
//             className="absolute w-12 h-12 -top-3 left-4"
//           />
//         </motion.div>

//         {/* Tier 1 - Bottom */}
//         <motion.div
//           className="bg-pink-400 w-full h-20 rounded-t-3xl mb-1 relative shadow-lg flex items-center justify-center mt-1"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <img
//             src="https://media.tenor.com/3nT-5pb890wAAAAj/sparkle.gif"
//             alt="sparkle"
//             className="absolute w-12 h-12 -top-4 right-4"
//           />
//         </motion.div>
//       </div>

//       {/* Buttons */}
//       {flameVisible && (
//         <div className="mt-6 flex flex-col gap-3">
//           <button
//             onClick={startMicDetection}
//             className="bg-blue-400 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-500"
//           >
//             Blow Into Mic 🎤
//           </button>
//           <button
//             onClick={blowCandle}
//             className="bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-600"
//           >
//             Blow Candle 🎉
//           </button>
//         </div>
//       )}

//       {/* Message popup */}
//       {messageVisible && (
//         <motion.div
//           className="mt-6 p-6 bg-white rounded-2xl shadow-2xl max-w-md text-gray-700"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <p className="mb-4 text-lg">
//             I wish you all the happiness in the world. <br />
//             May all your 11:11 wishes come true. <br />
//             Let's make beautiful memories together. <br />
//             Sending you loads of kisses. <br />
//             <b>Happy birthday, my moon. 🌙❤️</b>
//           </p>
//           <button
//             onClick={onNext}
//             className="mt-2 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-600"
//           >
//             Continue 💖
//           </button>
//         </motion.div>
//       )}
//     </div>
//   );
// }













// import { useState } from "react";
// import { motion } from "framer-motion";

// export default function CakeSection({ onNext }) {
//   const [blown, setBlown] = useState(false);

//   const handleBlow = () => {
//     setBlown(true);
//     // Trigger mic detection and gradual fade out animation here
//     setTimeout(onNext, 4000);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-pink-50">
//       <motion.div
//         className="w-32 h-32 bg-yellow-300 rounded-full flex items-center justify-center text-6xl"
//         animate={{ opacity: blown ? 0 : 1 }}
//         transition={{ duration: 2 }}
//       >
//         🕯️
//       </motion.div>
//       <p className="mt-4 text-center text-lg">Make a wish & blow the candle 🎂✨</p>
//       <button className="mt-4 px-4 py-2 bg-white rounded" onClick={handleBlow}>
//         Blow Candle
//       </button>
//     </div>
//   );
// }
