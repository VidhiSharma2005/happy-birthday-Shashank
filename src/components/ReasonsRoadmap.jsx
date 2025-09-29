import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";

const REASONS = [
  "Your smile makes me smile 😊",
  "Your voice gives me butterflies 🦋",
  "The way you look at me makes me feel warm ❤️",
  "Your breathing (yes, I'm a creep 😘)",
  "Your cute little snaps every day 📸",
  "The fact that you try 💪",
  "Your weird, ragebaiting sense of humor 🤪",
  "Your ugly face… yes I do love it 😍",
  "You always make even boring days fun ✨",
  "You make me feel safe and silly at once 💞"
];

export default function ReasonsRoadmap({ onNext }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const railRef = useRef(null);
  const wrapperRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [currentStop, setCurrentStop] = useState(0);

  // Use MotionValue for x to animate and drag
  const x = useMotionValue(0);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  // Compute points along path
  useEffect(() => {
    const computePoints = () => {
      const pathEl = pathRef.current;
      const svgEl = svgRef.current;
      if (!pathEl || !svgEl) return;

      const totalLen = pathEl.getTotalLength();
      const pts = [];

      for (let i = 0; i < REASONS.length; i++) {
        const t = i / (REASONS.length - 1);
        const lengthAt = totalLen * t;
        const p = pathEl.getPointAtLength(lengthAt);
        const ahead = pathEl.getPointAtLength(Math.min(totalLen, lengthAt + 1));
        const angle = Math.atan2(ahead.y - p.y, ahead.x - p.x) * (180 / Math.PI);
        pts.push({ x: p.x, y: p.y, angle });
      }

      setPoints(pts);

      // Set drag constraints
      if (railRef.current && wrapperRef.current) {
        const maxScroll = Math.max(0, railRef.current.scrollWidth - wrapperRef.current.clientWidth);
        setDragConstraints({ left: -maxScroll, right: 0 });
      }
    };

    computePoints();
    window.addEventListener("resize", computePoints);
    return () => window.removeEventListener("resize", computePoints);
  }, []);

  // Center selected stop
  const goToStop = (index) => {
    setCurrentStop(index);
    if (!points[index] || !railRef.current || !wrapperRef.current) return;

    const wrapperCenter = wrapperRef.current.clientWidth / 2;
    const targetX = wrapperCenter - points[index].x;

    const maxScroll = -(railRef.current.scrollWidth - wrapperRef.current.clientWidth);
    const finalX = Math.max(maxScroll, Math.min(0, targetX));

    animate(x, finalX, { type: "spring", stiffness: 120, damping: 18 });
  };

  const nextStop = () => {
    if (currentStop < REASONS.length - 1) goToStop(currentStop + 1);
    else onNext && onNext();
  };

  const carPos = points[currentStop] || { x: 50 + currentStop * 120, y: 60, angle: 0 };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-start bg-gradient-to-t from-yellow-50 to-pink-50 p-6 overflow-hidden">
      <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-4">🚗 Reasons I Love You</h1>
      <p className="text-sm text-gray-600 mb-4 max-w-xl text-center">
        Take a long drive with me — click each stop to reveal a reason I love you. Drag the road horizontally on mobile.
      </p>

      {/* Road wrapper */}
      <div className="w-full max-w-5xl overflow-hidden relative" ref={wrapperRef}>
        <motion.div
          ref={railRef}
          className="relative"
          drag="x"
          dragConstraints={dragConstraints}
          dragElastic={0.25}
          style={{ cursor: "grab", touchAction: "pan-y", x }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 2000 200"
            className="w-[2000px] h-48"
            preserveAspectRatio="xMinYMid meet"
          >
            <defs>
              <linearGradient id="roadGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#f6c6dd" />
                <stop offset="100%" stopColor="#ffd1d9" />
              </linearGradient>
            </defs>

            <path
              ref={pathRef}
              d="M50,140 C300,10 700,210 1000,90 C1300,-20 1600,180 1950,80"
              stroke="#F472B6"
              strokeWidth="12"
              fill="transparent"
              strokeLinecap="round"
            />
            <path
              d="M50,140 C300,10 700,210 1000,90 C1300,-20 1600,180 1950,80"
              stroke="#fff6"
              strokeWidth="2"
              strokeDasharray="10 14"
              fill="transparent"
            />

            {points.length === REASONS.length &&
              points.map((pt, idx) => (
                <g key={idx} transform={`translate(${pt.x}, ${pt.y})`}>
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.15 }}
                    style={{ originX: "50%", originY: "50%" }}
                  >
                    <circle cx="0" cy="0" r="16" fill="#ec4899" stroke="#fff" strokeWidth="3" />
                    <text
                      x="0"
                      y="6"
                      textAnchor="middle"
                      fontSize="12"
                      fill="#fff"
                      fontWeight="700"
                      style={{ pointerEvents: "none" }}
                    >
                      {idx + 1}
                    </text>
                  </motion.g>
                  <motion.text
                    x={24}
                    y={-10}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0], y: [-6, -14, -22] }}
                    transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
                    style={{ fontSize: 18 }}
                  >
                    {idx % 2 === 0 ? "💖" : "✨"}
                  </motion.text>
                  <rect
                    x={-32}
                    y={-32}
                    width={64}
                    height={64}
                    fill="transparent"
                    cursor="pointer"
                    onClick={() => goToStop(idx)}
                  />
                </g>
              ))}
          </svg>

          {/* Car using local SVG */}
          <motion.img
            src="src/assets/7317982.png"
            alt="car"
            className="absolute w-14 h-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: carPos.x, top: carPos.y - 18, transformOrigin: "center" }}
            animate={{
              left: points[currentStop] ? points[currentStop].x : carPos.x,
              top: points[currentStop] ? points[currentStop].y - 18 : carPos.y - 18,
              rotate: points[currentStop] ? points[currentStop].angle : 180
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20, ease: "easeInOut", duration: 0.7 }}
          />
        </motion.div>
      </div>

      {/* Reason panel */}
      <div className="w-full max-w-2xl mt-6">
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={currentStop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="bg-white rounded-2xl p-6 shadow-md text-center"
            layout
          >
            <h2 className="text-xl font-semibold mb-2">Stop {currentStop + 1}</h2>
            <p className="text-gray-700 mb-4">{REASONS[currentStop]}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => currentStop > 0 && goToStop(currentStop - 1)}
                className="px-4 py-2 rounded-full border"
              >
                Prev
              </button>
              <button
                onClick={nextStop}
                className="px-4 py-2 rounded-full bg-pink-500 text-white shadow"
              >
                {currentStop === REASONS.length - 1 ? "Go to Playlist💖" : "Next Stop ➡️"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}


// import React, { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";

// const REASONS = [
//   "Your smile makes me smile 😊",
//   "Your voice gives me butterflies 🦋",
//   "The way you look at me makes me feel warm ❤️",
//   "Your breathing (yes, I'm a creep 😘)",
//   "Your cute little snaps every day 📸",
//   "The fact that you try 💪",
//   "Your weird, ragebaiting sense of humor 🤪",
//   "Your ugly face… yes I do love it 😍",
//   "You always make even boring days fun ✨",
//   "You make me feel safe and silly at once 💞"
// ];

// export default function ReasonsRoadmap({ onNext }) {
//   const svgRef = useRef(null);
//   const pathRef = useRef(null);
//   const railRef = useRef(null);
//   const wrapperRef = useRef(null);
//   const [points, setPoints] = useState([]);
//   const [currentStop, setCurrentStop] = useState(0);

//   // Use MotionValue for x to animate and drag
//   const x = useMotionValue(0);
//   const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

//   // Compute points along path
//   useEffect(() => {
//     const computePoints = () => {
//       const pathEl = pathRef.current;
//       const svgEl = svgRef.current;
//       if (!pathEl || !svgEl) return;

//       const totalLen = pathEl.getTotalLength();
//       const pts = [];

//       for (let i = 0; i < REASONS.length; i++) {
//         const t = i / (REASONS.length - 1);
//         const lengthAt = totalLen * t;
//         const p = pathEl.getPointAtLength(lengthAt);
//         const ahead = pathEl.getPointAtLength(Math.min(totalLen, lengthAt + 1));
//         const angle = Math.atan2(ahead.y - p.y, ahead.x - p.x) * (180 / Math.PI);
//         pts.push({ x: p.x, y: p.y, angle });
//       }

//       setPoints(pts);

//       // Set drag constraints
//       if (railRef.current && wrapperRef.current) {
//         const maxScroll = Math.max(0, railRef.current.scrollWidth - wrapperRef.current.clientWidth);
//         setDragConstraints({ left: -maxScroll, right: 0 });
//       }
//     };

//     computePoints();
//     window.addEventListener("resize", computePoints);
//     return () => window.removeEventListener("resize", computePoints);
//   }, []);

//   // Center selected stop
//   const goToStop = (index) => {
//     setCurrentStop(index);
//     if (!points[index] || !railRef.current || !wrapperRef.current) return;

//     const wrapperCenter = wrapperRef.current.clientWidth / 2;
//     const targetX = wrapperCenter - points[index].x;

//     const maxScroll = -(railRef.current.scrollWidth - wrapperRef.current.clientWidth);
//     const finalX = Math.max(maxScroll, Math.min(0, targetX));

//     animate(x, finalX, { type: "spring", stiffness: 120, damping: 18 });
//   };

//   const nextStop = () => {
//     if (currentStop < REASONS.length - 1) goToStop(currentStop + 1);
//     else onNext && onNext();
//   };

//   const carPos = points[currentStop] || { x: 50 + currentStop * 120, y: 60, angle: 0 };

//   return (
//     <div className="h-screen w-full flex flex-col items-center justify-start bg-gradient-to-t from-yellow-50 to-pink-50 p-6 overflow-hidden">
//       <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-4">🚗 Reasons I Love You</h1>
//       <p className="text-sm text-gray-600 mb-4 max-w-xl text-center">
//         Take a drive with Kitty — click each stop to reveal a reason I love you. Drag the road horizontally on mobile.
//       </p>

//       {/* Road wrapper */}
//       <div className="w-full max-w-5xl overflow-hidden relative" ref={wrapperRef}>
//         <motion.div
//           ref={railRef}
//           className="relative"
//           drag="x"
//           dragConstraints={dragConstraints}
//           dragElastic={0.25}
//           style={{ cursor: "grab", touchAction: "pan-y", x }}
//         >
//           <svg
//             ref={svgRef}
//             viewBox="0 0 2000 200"
//             className="w-[2000px] h-48"
//             preserveAspectRatio="xMinYMid meet"
//           >
//             <defs>
//               <linearGradient id="roadGrad" x1="0" x2="1">
//                 <stop offset="0%" stopColor="#f6c6dd" />
//                 <stop offset="100%" stopColor="#ffd1d9" />
//               </linearGradient>
//             </defs>

//             <path
//               ref={pathRef}
//               d="M50,140 C300,10 700,210 1000,90 C1300,-20 1600,180 1950,80"
//               stroke="#F472B6"
//               strokeWidth="12"
//               fill="transparent"
//               strokeLinecap="round"
//             />
//             <path
//               d="M50,140 C300,10 700,210 1000,90 C1300,-20 1600,180 1950,80"
//               stroke="#fff6"
//               strokeWidth="2"
//               strokeDasharray="10 14"
//               fill="transparent"
//             />

//             {points.length === REASONS.length &&
//               points.map((pt, idx) => (
//                 <g key={idx} transform={`translate(${pt.x}, ${pt.y})`}>
//                   <motion.g
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     whileHover={{ scale: 1.15 }}
//                     style={{ originX: "50%", originY: "50%" }}
//                   >
//                     <circle cx="0" cy="0" r="16" fill="#ec4899" stroke="#fff" strokeWidth="3" />
//                     <text
//                       x="0"
//                       y="6"
//                       textAnchor="middle"
//                       fontSize="12"
//                       fill="#fff"
//                       fontWeight="700"
//                       style={{ pointerEvents: "none" }}
//                     >
//                       {idx + 1}
//                     </text>
//                   </motion.g>
//                   <motion.text
//                     x={24}
//                     y={-10}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: [0, 1, 0], y: [-6, -14, -22] }}
//                     transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
//                     style={{ fontSize: 18 }}
//                   >
//                     {idx % 2 === 0 ? "💖" : "✨"}
//                   </motion.text>
//                   <rect
//                     x={-32}
//                     y={-32}
//                     width={64}
//                     height={64}
//                     fill="transparent"
//                     cursor="pointer"
//                     onClick={() => goToStop(idx)}
//                   />
//                 </g>
//               ))}
//           </svg>

//           {/* Car using local SVG */}
//           <motion.img
//             src="src/assets/7317982.png"
//             alt="car"
//             className="absolute w-14 h-10 -translate-x-1/2 -translate-y-1/2"
//             style={{ left: carPos.x, top: carPos.y - 18, transformOrigin: "center" }}
//             animate={{
//               left: points[currentStop] ? points[currentStop].x : carPos.x,
//               top: points[currentStop] ? points[currentStop].y - 18 : carPos.y - 18,
//               rotate: points[currentStop] ? points[currentStop].angle : 180
//             }}
//             transition={{ type: "spring", stiffness: 120, damping: 18 }}
//           />
//         </motion.div>
//       </div>

//       {/* Reason panel */}
//       <div className="w-full max-w-2xl mt-6">
//         <AnimatePresence exitBeforeEnter>
//           <motion.div
//             key={currentStop}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -8 }}
//             transition={{ duration: 0.35 }}
//             className="bg-white rounded-2xl p-6 shadow-md text-center"
//           >
//             <h2 className="text-xl font-semibold mb-2">Stop {currentStop + 1}</h2>
//             <p className="text-gray-700 mb-4">{REASONS[currentStop]}</p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => currentStop > 0 && goToStop(currentStop - 1)}
//                 className="px-4 py-2 rounded-full border"
//               >
//                 Prev
//               </button>
//               <button
//                 onClick={nextStop}
//                 className="px-4 py-2 rounded-full bg-pink-500 text-white shadow"
//               >
//                 {currentStop === REASONS.length - 1 ? "Go to Playlist💖" : "Next Stop ➡️"}
//               </button>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }





// import React, { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence, animate } from "framer-motion";

// const REASONS = [
//     "Your smile makes me smile 😊",
//     "Your voice gives me butterflies 🦋",
//     "The way you look at me makes me feel warm ❤️",
//     "Your breathing (yes, I'm a creep 😘)",
//     "Your cute little snaps every day 📸",
//     "The fact that you try 💪",
//     "Your weird, ragebaiting sense of humor 🤪",
//     "Your ugly face… yes I do love it 😍",
//     "You always make even boring days fun ✨",
//     "You make me feel safe and silly at once 💞"
// ];

// export default function ReasonsRoadmap({ onNext }) {
//     const svgRef = useRef(null);
//     const pathRef = useRef(null);
//     const railRef = useRef(null);
//     const wrapperRef = useRef(null);
//     const [points, setPoints] = useState([]);
//     const [currentStop, setCurrentStop] = useState(0);
//     const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

//     // Compute points along path
//     useEffect(() => {
//         const computePoints = () => {
//             const pathEl = pathRef.current;
//             const svgEl = svgRef.current;
//             if (!pathEl || !svgEl) return;

//             const totalLen = pathEl.getTotalLength();
//             const pts = [];

//             for (let i = 0; i < REASONS.length; i++) {
//                 const t = i / (REASONS.length - 1);
//                 const lengthAt = totalLen * t;
//                 const p = pathEl.getPointAtLength(lengthAt);
//                 const ahead = pathEl.getPointAtLength(Math.min(totalLen, lengthAt + 1));
//                 const angle = Math.atan2(ahead.y - p.y, ahead.x - p.x) * (180 / Math.PI);
//                 pts.push({ x: p.x, y: p.y, angle });
//             }

//             setPoints(pts);

//             // Drag constraints
//             if (railRef.current && wrapperRef.current) {
//                 const maxScroll = Math.max(0, railRef.current.scrollWidth - wrapperRef.current.clientWidth);
//                 setDragConstraints({ left: -maxScroll, right: 0 });
//             }
//         };

//         computePoints();
//         window.addEventListener("resize", computePoints);
//         return () => window.removeEventListener("resize", computePoints);
//     }, []);

//     // Center selected stop
//     const goToStop = (index) => {
//         setCurrentStop(index);
//         if (!railRef.current || !wrapperRef.current || !points[index]) return;

//         const rail = railRef.current;
//         const wrapper = wrapperRef.current;
//         const stopX = points[index].x;

//         const wrapperCenter = wrapper.clientWidth / 2;
//         const targetX = Math.min(0, wrapperCenter - stopX);
//         const maxScroll = -(rail.scrollWidth - wrapper.clientWidth);
//         const finalX = Math.max(maxScroll, targetX);

//         animate(rail, { x: finalX }, { type: "spring", stiffness: 120, damping: 18 });
//     };

//     const nextStop = () => {
//         if (currentStop < REASONS.length - 1) setCurrentStop((s) => s + 1);
//         else onNext && onNext();
//     };

//     const carPos = points[currentStop] || { x: 50 + currentStop * 120, y: 60, angle: 0 };

//     return (
//         <div className="h-screen w-full flex flex-col items-center justify-start bg-gradient-to-t from-yellow-50 to-pink-50 p-6 overflow-hidden">
//             <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-4">🚗 Reasons I Love You</h1>
//             <p className="text-sm text-gray-600 mb-4 max-w-xl text-center">
//                 Take a drive with Kitty — click each stop to reveal a reason I love you. Drag the road horizontally on mobile.
//             </p>

//             {/* Road wrapper */}
//             <div className="w-full max-w-5xl overflow-hidden relative" ref={wrapperRef}>
//                 <motion.div
//                     ref={railRef}
//                     className="relative"
//                     drag="x"
//                     dragConstraints={dragConstraints}
//                     dragElastic={0.25}
//                     style={{ cursor: "grab", touchAction: "pan-y" }}
//                 >
//                     <svg
//                         ref={svgRef}
//                         viewBox="0 0 2000 200"
//                         className="w-[2000px] h-48"
//                         preserveAspectRatio="xMinYMid meet"
//                     >
//                         <defs>
//                             <linearGradient id="roadGrad" x1="0" x2="1">
//                                 <stop offset="0%" stopColor="#f6c6dd" />
//                                 <stop offset="100%" stopColor="#ffd1d9" />
//                             </linearGradient>
//                         </defs>

//                         <path
//                             ref={pathRef}
//                             d="M50,140 C300,10 700,210 1000,90 C1300,-20 1600,180 1950,80"
//                             stroke="#F472B6"
//                             strokeWidth="12"
//                             fill="transparent"
//                             strokeLinecap="round"
//                         />
//                         <path
//                             d="M50,140 C300,10 700,210 1000,90 C1300,-20 1600,180 1950,80"
//                             stroke="#fff6"
//                             strokeWidth="2"
//                             strokeDasharray="10 14"
//                             fill="transparent"
//                         />

//                         {points.length === REASONS.length &&
//                             points.map((pt, idx) => (
//                                 <g key={idx} transform={`translate(${pt.x}, ${pt.y})`}>
//                                     <motion.g
//                                         initial={{ scale: 0 }}
//                                         animate={{ scale: 1 }}
//                                         whileHover={{ scale: 1.15 }}
//                                         style={{ originX: "50%", originY: "50%" }}
//                                     >
//                                         <circle cx="0" cy="0" r="16" fill="#ec4899" stroke="#fff" strokeWidth="3" />
//                                         <text
//                                             x="0"
//                                             y="6"
//                                             textAnchor="middle"
//                                             fontSize="12"
//                                             fill="#fff"
//                                             fontWeight="700"
//                                             style={{ pointerEvents: "none" }}
//                                         >
//                                             {idx + 1}
//                                         </text>
//                                     </motion.g>
//                                     <motion.text
//                                         x={24}
//                                         y={-10}
//                                         initial={{ opacity: 0 }}
//                                         animate={{ opacity: [0, 1, 0], y: [-6, -14, -22] }}
//                                         transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
//                                         style={{ fontSize: 18 }}
//                                     >
//                                         {idx % 2 === 0 ? "💖" : "✨"}
//                                     </motion.text>
//                                     <rect
//                                         x={-32}
//                                         y={-32}
//                                         width={64}
//                                         height={64}
//                                         fill="transparent"
//                                         cursor="pointer"
//                                         onClick={() => goToStop(idx)}
//                                     />
//                                 </g>
//                             ))}
//                     </svg>

//                     {/* Car using your local SVG */}
//                     <motion.img
//                         src="src\assets\7317982.png"
//                         alt="car"
//                         className="absolute w-14 h-10 -translate-x-1/2 -translate-y-1/2"
//                         style={{
//                             left: carPos.x,
//                             top: carPos.y - 18,
//                             transformOrigin: "center",
//                         }}
//                         animate={{
//                             left: points[currentStop] ? points[currentStop].x : carPos.x,
//                             top: points[currentStop] ? points[currentStop].y - 18 : carPos.y - 18,
//                             rotate: points[currentStop] ? points[currentStop].angle : 180
//                         }}
//                         transition={{ type: "spring", stiffness: 120, damping: 18 }}
//                     />
//                 </motion.div>
//             </div>

//             {/* Reason panel */}
//             <div className="w-full max-w-2xl mt-6">
//                 <AnimatePresence exitBeforeEnter>
//                     <motion.div
//                         key={currentStop}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -8 }}
//                         transition={{ duration: 0.35 }}
//                         className="bg-white rounded-2xl p-6 shadow-md text-center"
//                     >
//                         <h2 className="text-xl font-semibold mb-2">Stop {currentStop + 1}</h2>
//                         <p className="text-gray-700 mb-4">{REASONS[currentStop]}</p>
//                         <div className="flex justify-center gap-4">
//                             <button
//                                 onClick={() => currentStop > 0 && setCurrentStop((s) => s - 1)}
//                                 className="px-4 py-2 rounded-full border"
//                             >
//                                 Prev
//                             </button>
//                             <button
//                                 onClick={nextStop}
//                                 className="px-4 py-2 rounded-full bg-pink-500 text-white shadow"
//                             >
//                                 {currentStop === REASONS.length - 1 ? "Go to Memories 💖" : "Next Stop ➡️"}
//                             </button>
//                         </div>
//                     </motion.div>
//                 </AnimatePresence>
//             </div>
//         </div>
//     );
// }



// import React, { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// /**
//  * ReasonsRoadmap
//  * - onNext(): called when user reaches final stop and clicks "Go to Memories"
//  *
//  * Notes:
//  * - The SVG road is wide; container is draggable horizontally on touch.
//  * - Stops and the car are positioned based on the SVG path using getPointAtLength.
//  * - Car faces left (rotated 180deg).
//  * - Floating hearts/sparkles animate at each stop.
//  */

// const REASONS = [
//   "Your smile makes me smile 😊",
//   "Your voice gives me butterflies 🦋",
//   "The way you look at me makes me feel warm ❤️",
//   "Your breathing (yes, I'm a creep 😘)",
//   "Your cute little snaps every day 📸",
//   "The fact that you try 💪",
//   "Your weird, ragebaiting sense of humor 🤪",
//   "Your ugly face… yes I do love it 😍",
//   "You always make even boring days fun ✨",      // +1 new reason
//   "You make me feel safe and silly at once 💞"  // +2 new reason
// ];

// export default function ReasonsRoadmap({ onNext }) {
//   const svgRef = useRef(null);
//   const pathRef = useRef(null);
//   const railRef = useRef(null); // draggable container ref
//   const [points, setPoints] = useState([]); // [{x,y,angle}, ...]
//   const [currentStop, setCurrentStop] = useState(0);
//   const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

//   // compute points along path after mount / resize
//   useEffect(() => {
//     const computePoints = () => {
//       const pathEl = pathRef.current;
//       const svgEl = svgRef.current;
//       if (!pathEl || !svgEl) return;

//       const totalLen = pathEl.getTotalLength();
//       const stops = REASONS.length;
//       const pts = [];

//       for (let i = 0; i < stops; i++) {
//         const t = i / (stops - 1);
//         const lengthAt = totalLen * t;
//         const p = pathEl.getPointAtLength(lengthAt);
//         // compute small angle by sampling nearby points
//         const ahead = pathEl.getPointAtLength(Math.min(totalLen, lengthAt + 1));
//         const angle = Math.atan2(ahead.y - p.y, ahead.x - p.x) * (180 / Math.PI);
//         pts.push({ x: p.x, y: p.y, angle });
//       }

//       // Convert SVG coordinates to page coords by using svg bounding rect
//       const bbox = svgEl.getBoundingClientRect();
//       const adjusted = pts.map((pt) => ({
//         x: pt.x + bbox.left,
//         y: pt.y + bbox.top,
//         angle: pt.angle
//       }));

//       // But to position inside relative container, we need coordinates relative to the rail container
//       const railRect = railRef.current.getBoundingClientRect();
//       const localPts = pts.map((pt) => ({
//         x: pt.x, // using SVG local coords for absolute positioning inside svg wrapper
//         y: pt.y,
//         angle: pt.angle
//       }));

//       setPoints(localPts);

//       // calculate drag constraints
//       // railRef width minus visible viewport width of the wrapper
//       const wrapper = railRef.current.parentElement;
//       if (wrapper) {
//         const maxScroll = Math.max(0, railRef.current.scrollWidth - wrapper.clientWidth);
//         setDragConstraints({ left: -maxScroll, right: 0 });
//       }
//     };

//     computePoints();
//     window.addEventListener("resize", computePoints);
//     return () => window.removeEventListener("resize", computePoints);
//   }, []);

//   // move car to chosen stop (center the stop on small screens by translate the draggable container)
//   const goToStop = (index) => {
//     setCurrentStop(index);
//     // optionally center the stop on small screens by shifting the rail (handled by user drag primarily)
//   };

//   const nextStop = () => {
//     if (currentStop < REASONS.length - 1) setCurrentStop((s) => s + 1);
//     else onNext && onNext();
//   };

//   // Car position helpers - default fallback if points not ready
//   const carPos = points[currentStop] || { x: 50 + currentStop * 120, y: 60, angle: 0 };

//   return (
//     <div className="h-screen w-full flex flex-col items-center justify-start bg-gradient-to-t from-yellow-50 to-pink-50 p-6 overflow-hidden">
//       <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-4">🚗 Reasons I Love You</h1>
//       <p className="text-sm text-gray-600 mb-4 max-w-xl text-center">
//         Take a drive with Kitty — click each stop to reveal a reason I love you. Drag the road horizontally on mobile.
//       </p>

//       {/* Road wrapper with horizontal drag */}
//       <div className="w-full max-w-5xl overflow-hidden relative">
//         {/* draggable rail: wide svg inside */}
//         <motion.div
//           ref={railRef}
//           className="relative"
//           drag="x"
//           dragConstraints={dragConstraints}
//           dragElastic={0.25}
//           style={{ cursor: "grab", touchAction: "pan-y" }}
//         >
//           {/* Big SVG road (wide). Adjust viewBox width to make room */}
//           <svg
//             ref={svgRef}
//             viewBox="0 0 2000 200"
//             className="w-[2000px] h-48"
//             preserveAspectRatio="xMinYMid meet"
//           >
//             {/* Background curved path */}
//             <defs>
//               <linearGradient id="roadGrad" x1="0" x2="1">
//                 <stop offset="0%" stopColor="#f6c6dd" />
//                 <stop offset="100%" stopColor="#ffd1d9" />
//               </linearGradient>
//             </defs>

//             <path
//               ref={pathRef}
//               d="M50,140 C300,10 700,210 1000,90 C1300,-20 1600,180 1950,80"
//               stroke="#F472B6"
//               strokeWidth="12"
//               fill="transparent"
//               strokeLinecap="round"
//             />

//             {/* small dashed center line */}
//             <path
//               d="M50,140 C300,10 700,210 1000,90 C1300,-20 1600,180 1950,80"
//               stroke="#fff6"
//               strokeWidth="2"
//               strokeDasharray="10 14"
//               fill="transparent"
//             />

//             {/* Stops rendered as circles placed on path positions using points[] (fallback positions provided) */}
//             {points.length === REASONS.length
//               ? points.map((pt, idx) => (
//                   <g key={idx} transform={`translate(${pt.x}, ${pt.y})`}>
//                     {/* stop marker (circle) */}
//                     <motion.g
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       whileHover={{ scale: 1.15 }}
//                       style={{ originX: "50%", originY: "50%" }}
//                     >
//                       <circle cx="0" cy="0" r="16" fill="#ec4899" stroke="#fff" strokeWidth="3" />
//                       <text
//                         x="0"
//                         y="6"
//                         textAnchor="middle"
//                         fontSize="12"
//                         fill="#fff"
//                         fontWeight="700"
//                         style={{ pointerEvents: "none" }}
//                       >
//                         {idx + 1}
//                       </text>
//                     </motion.g>

//                     {/* small floating heart animation near stop */}
//                     <motion.text
//                       x={24}
//                       y={-10}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: [0, 1, 0], y: [-6, -14, -22] }}
//                       transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
//                       style={{ fontSize: 18 }}
//                     >
//                       {idx % 2 === 0 ? "💖" : "✨"}
//                     </motion.text>

//                     {/* clickable transparent rect over the stop (improve hit area) */}
//                     <rect
//                       x={-32}
//                       y={-32}
//                       width={64}
//                       height={64}
//                       fill="transparent"
//                       cursor="pointer"
//                       onClick={() => goToStop(idx)}
//                     />
//                   </g>
//                 ))
//               : // fallback rendering approximate stops evenly spaced along the svg width
//                 Array.from({ length: REASONS.length }).map((_, idx) => {
//                   const x = 50 + (idx / (REASONS.length - 1)) * 1900;
//                   const y = 120 + Math.sin((idx / (REASONS.length - 1)) * Math.PI) * -60;
//                   return (
//                     <g key={idx} transform={`translate(${x}, ${y})`} onClick={() => goToStop(idx)}>
//                       <circle cx="0" cy="0" r="16" fill="#ec4899" stroke="#fff" strokeWidth="3" />
//                       <text x="0" y="6" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">
//                         {idx + 1}
//                       </text>
//                       <text x={24} y={-10} style={{ fontSize: 18 }} opacity={0.9}>
//                         {idx % 2 === 0 ? "💖" : "✨"}
//                       </text>
//                     </g>
//                   );
//                 })}
//           </svg>

//           {/* Car: absolutely positioned relative to svg container.
//               Use the local SVG coordinates to set left/top. */}
//           <motion.div
//             className="absolute w-14 h-10 -translate-x-1/2 -translate-y-1/2"
//             style={{
//               left: `${carPos.x || 50}px`,
//               top: `${carPos.y || 60}px`,
//               transformOrigin: "center",
//             }}
//             animate={{
//               left: points[currentStop] ? `${points[currentStop].x}px` : `${carPos.x}px`,
//               top: points[currentStop] ? `${points[currentStop].y - 18}px` : `${carPos.y - 18}px`,
//               rotate: points[currentStop] ? points[currentStop].angle +0 : 180 // face left: +180
//             }}
//             transition={{ type: "spring", stiffness: 120, damping: 18 }}
//           >
//             {/* Car body (emoji) - flipped to face left by rotating 180deg */}
//             <div className="w-full h-full flex items-center justify-center text-2xl select-none">
//               🚘
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Reason panel */}
//       <div className="w-full max-w-2xl mt-6">
//         <AnimatePresence exitBeforeEnter>
//           <motion.div
//             key={currentStop}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -8 }}
//             transition={{ duration: 0.35 }}
//             className="bg-white rounded-2xl p-6 shadow-md text-center"
//           >
//             <h2 className="text-xl font-semibold mb-2">Stop {currentStop + 1}</h2>
//             <p className="text-gray-700 mb-4">{REASONS[currentStop]}</p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => currentStop > 0 && setCurrentStop((s) => s - 1)}
//                 className="px-4 py-2 rounded-full border"
//               >
//                 Prev
//               </button>
//               <button
//                 onClick={nextStop}
//                 className="px-4 py-2 rounded-full bg-pink-500 text-white shadow"
//               >
//                 {currentStop === REASONS.length - 1 ? "Go to Memories 💖" : "Next Stop ➡️"}
//               </button>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const REASONS = [
//   "Your smile makes me smile 😊",
//   "Your voice gives me butterflies 🦋",
//   "The way you look at me makes me feel warm ❤️",
//   "Your breathing (yes, I'm a creep 😘)",
//   "Your cute little snaps every day 📸",
//   "The fact that you try 💪",
//   "Your weird, ragebaiting sense of humor 🤪",
//   "Your ugly face… yes I do love it 😍",
//   "You always make even boring days fun ✨",
//   "You make me feel safe and silly at once 💞"
// ];

// export default function ReasonsRoadmap({ onNext }) {
//   const svgRef = useRef(null);
//   const pathRef = useRef(null);
//   const railRef = useRef(null);
//   const [points, setPoints] = useState([]);
//   const [currentStop, setCurrentStop] = useState(0);
//   const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

//   useEffect(() => {
//     const computePoints = () => {
//       const pathEl = pathRef.current;
//       const svgEl = svgRef.current;
//       if (!pathEl || !svgEl || !railRef.current) return;

//       const totalLen = pathEl.getTotalLength();
//       const stops = REASONS.length;
//       const pts = [];

//       for (let i = 0; i < stops; i++) {
//         const t = i / (stops - 1);
//         const lengthAt = totalLen * t;
//         const p = pathEl.getPointAtLength(lengthAt);
//         const ahead = pathEl.getPointAtLength(Math.min(totalLen, lengthAt + 1));
//         const angle = Math.atan2(ahead.y - p.y, ahead.x - p.x) * (180 / Math.PI);
//         pts.push({ x: p.x, y: p.y, angle });
//       }

//       setPoints(pts);

//       // compute drag constraints
//       const wrapper = railRef.current.parentElement;
//       if (wrapper) {
//         const maxScroll = Math.max(0, railRef.current.scrollWidth - wrapper.clientWidth);
//         setDragConstraints({ left: -maxScroll, right: 0 });
//       }
//     };

//     computePoints();
//     window.addEventListener("resize", computePoints);
//     return () => window.removeEventListener("resize", computePoints);
//   }, []);

//   const goToStop = (index) => setCurrentStop(index);

//   const nextStop = () => {
//     if (currentStop < REASONS.length - 1) setCurrentStop((s) => s + 1);
//     else onNext && onNext();
//   };

//   // fallback car pos
//   const carPos = points[currentStop] || { x: 50 + currentStop * 120, y: 60, angle: 0 };

//   return (
//     <div className="h-screen w-full flex flex-col items-center justify-start bg-gradient-to-t from-yellow-50 to-pink-50 p-6 overflow-hidden">
//       <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-4">🚗 Reasons I Love You</h1>
//       <p className="text-sm text-gray-600 mb-4 max-w-xl text-center">
//         Take a drive with Kitty — click each stop to reveal a reason I love you. Drag the road horizontally on mobile.
//       </p>

//       <div className="w-full max-w-5xl overflow-hidden relative">
//         <motion.div
//           ref={railRef}
//           className="relative"
//           drag="x"
//           dragConstraints={dragConstraints}
//           dragElastic={0.25}
//           style={{ cursor: "grab", touchAction: "pan-y" }}
//         >
//           <svg
//             ref={svgRef}
//             viewBox="0 0 2000 200"
//             className="w-[2000px] h-48"
//             preserveAspectRatio="xMinYMid meet"
//           >
//             <defs>
//               <linearGradient id="roadGrad" x1="0" x2="1">
//                 <stop offset="0%" stopColor="#f6c6dd" />
//                 <stop offset="100%" stopColor="#ffd1d9" />
//               </linearGradient>
//             </defs>

//             <path
//               ref={pathRef}
//               d="M50,140 C300,10 700,210 1000,90 C1300,-20 1600,180 1950,80"
//               stroke="#F472B6"
//               strokeWidth="12"
//               fill="transparent"
//               strokeLinecap="round"
//             />

//             <path
//               d="M50,140 C300,10 700,210 1000,90 C1300,-20 1600,180 1950,80"
//               stroke="#fff6"
//               strokeWidth="2"
//               strokeDasharray="10 14"
//               fill="transparent"
//             />

//             {/* stops */}
//             {points.length === REASONS.length
//               ? points.map((pt, idx) => (
//                   <g key={idx} transform={`translate(${pt.x}, ${pt.y})`}>
//                     <motion.g
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       whileHover={{ scale: 1.15 }}
//                       style={{ originX: "50%", originY: "50%" }}
//                     >
//                       <circle cx="0" cy="0" r="16" fill="#ec4899" stroke="#fff" strokeWidth="3" />
//                       <text x="0" y="6" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700" style={{ pointerEvents: "none" }}>
//                         {idx + 1}
//                       </text>
//                     </motion.g>

//                     <motion.text
//                       x={24}
//                       y={-10}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: [0, 1, 0], y: [-6, -14, -22] }}
//                       transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
//                       style={{ fontSize: 18 }}
//                     >
//                       {idx % 2 === 0 ? "💖" : "✨"}
//                     </motion.text>

//                     <rect
//                       x={-32}
//                       y={-32}
//                       width={64}
//                       height={64}
//                       fill="transparent"
//                       cursor="pointer"
//                       onClick={() => goToStop(idx)}
//                     />
//                   </g>
//                 ))
//               : Array.from({ length: REASONS.length }).map((_, idx) => {
//                   const x = 50 + (idx / (REASONS.length - 1)) * 1900;
//                   const y = 120 + Math.sin((idx / (REASONS.length - 1)) * Math.PI) * -60;
//                   return (
//                     <g key={idx} transform={`translate(${x}, ${y})`} onClick={() => goToStop(idx)}>
//                       <circle cx="0" cy="0" r="16" fill="#ec4899" stroke="#fff" strokeWidth="3" />
//                       <text x="0" y="6" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">
//                         {idx + 1}
//                       </text>
//                       <text x={24} y={-10} style={{ fontSize: 18 }} opacity={0.9}>
//                         {idx % 2 === 0 ? "💖" : "✨"}
//                       </text>
//                     </g>
//                   );
//                 })}
//           </svg>

//           {/* CAR: use an inline SVG car and rotate by (angle - 90) so it sits upright on the path */}
//           <motion.div
//             className="absolute w-16 h-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
//             style={{
//               left: `${carPos.x || 50}px`,
//               top: `${carPos.y || 60}px`,
//               transformOrigin: "center center"
//             }}
//             animate={{
//               left: points[currentStop] ? `${points[currentStop].x}px` : `${carPos.x}px`,
//               top: points[currentStop] ? `${points[currentStop].y - 18}px` : `${carPos.y - 18}px`,
//               // IMPORTANT FIX: subtract 90deg so the car is upright instead of upside-down
//               rotate: points[currentStop] ? points[currentStop].angle + 20 : -90
//             }}
//             transition={{ type: "spring", stiffness: 120, damping: 18 }}
//           >
//             {/* Inline SVG car (default facing to the RIGHT). rotate above aligns it along the path.
//                 If it's still mirrored in your environment, try changing `-90` to `+90`. */}
//             <svg width="64" height="40" viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg">
//               <g transform="translate(0,0)">
//                 <rect x="6" y="14" width="44" height="12" rx="3" fill="#FF6BBD" />
//                 <rect x="14" y="8" width="28" height="10" rx="2" fill="#FFD6E8" />
//                 <circle cx="18" cy="30" r="4" fill="#333" />
//                 <circle cx="46" cy="30" r="4" fill="#333" />
//                 {/* little window */}
//                 <rect x="20" y="10" width="10" height="6" rx="1" fill="#fff5" />
//               </g>
//             </svg>
//           </motion.div>
//         </motion.div>
//       </div>

//       <div className="w-full max-w-2xl mt-6">
//         <AnimatePresence exitBeforeEnter>
//           <motion.div
//             key={currentStop}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -8 }}
//             transition={{ duration: 0.35 }}
//             className="bg-white rounded-2xl p-6 shadow-md text-center"
//           >
//             <h2 className="text-xl font-semibold mb-2">Stop {currentStop + 1}</h2>
//             <p className="text-gray-700 mb-4">{REASONS[currentStop]}</p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => currentStop > 0 && setCurrentStop((s) => s - 1)}
//                 className="px-4 py-2 rounded-full border"
//               >
//                 Prev
//               </button>
//               <button
//                 onClick={nextStop}
//                 className="px-4 py-2 rounded-full bg-pink-500 text-white shadow"
//               >
//                 {currentStop === REASONS.length - 1 ? "Go to Memories 💖" : "Next Stop ➡️"}
//               </button>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }



// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, useGLTF } from "@react-three/drei";

// const reasons = [
//   "Your smile makes me smile 😊",
//   "Your voice gives me butterflies 🦋",
//   "The way you look at me makes me feel warm ❤️",
//   "Your breathing (yes, I'm a creep 😘)",
//   "Your cute little snaps every day 📸",
//   "The fact that you try 💪",
//   "Your weird, ragebaiting sense of humor 🤪",
//   "Your ugly face… yes I do love it 😍",
//   "You make me feel safe 🛡️",
//   "Your hugs are magical 🤗"
// ];

// // Spline 3D Car component
// function CarModel() {
//   const { scene } = useGLTF("/car_model.glb"); // Add your 3D car model path here
//   return <primitive object={scene} scale={0.5} />;
// }

// export default function ReasonsRoadmap({ onNext }) {
//   const [currentStop, setCurrentStop] = useState(0);

//   const nextStop = () => {
//     if (currentStop < reasons.length - 1) {
//       setCurrentStop(currentStop + 1);
//     } else {
//       onNext();
//     }
//   };

//   return (
//     <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-t from-yellow-50 to-pink-50 px-4 overflow-x-hidden relative">
//       <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-6">
//         🚗 Reasons I Love You
//       </h1>

//       {/* Road with stops */}
//       <div className="relative w-full max-w-5xl h-64 flex items-center justify-between">
//         {/* Curved road background */}
//         <svg viewBox="0 0 1000 150" className="w-full h-full absolute top-0 left-0">
//           <path
//             d="M0,120 C150,50 350,200 500,50 C650,0 850,150 1000,50"
//             stroke="#FBB6CE"
//             strokeWidth="8"
//             fill="transparent"
//           />
//         </svg>

//         {/* Stops */}
//         {reasons.map((reason, idx) => (
//           <motion.div
//             key={idx}
//             className="absolute w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer z-10"
//             style={{ left: `${(idx / (reasons.length - 1)) * 100}%` }}
//             whileHover={{ scale: 1.3 }}
//             onClick={() => setCurrentStop(idx)}
//           >
//             {idx + 1}
//           </motion.div>
//         ))}

//         {/* Car (3D or Emoji fallback) */}
//         <motion.div
//           className="absolute top-0 w-12 h-12 z-20"
//           animate={{ left: `${(currentStop / (reasons.length - 1)) * 100}%` }}
//           transition={{ type: "spring", stiffness: 100, damping: 15 }}
//         >
//           🚗
//         </motion.div>
//       </div>

//       {/* Reason popup with floating hearts */}
//       <AnimatePresence>
//         <motion.div
//           key={currentStop}
//           className="mt-10 p-6 bg-white rounded-2xl shadow-2xl max-w-lg text-center text-gray-700 relative"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.5 }}
//         >
//           <p className="text-lg mb-4">{reasons[currentStop]}</p>

//           {/* Floating hearts animation */}
//           <motion.div
//             className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 text-red-500 text-xl"
//             animate={{ y: [-10, -80], opacity: [1, 0], rotate: [0, 360] }}
//             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//           >
//             ❤️
//           </motion.div>

//           <button
//             onClick={nextStop}
//             className="mt-2 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-600"
//           >
//             {currentStop === reasons.length - 1 ? "Go to Memories 💖" : "Next Stop ➡️"}
//           </button>
//         </motion.div>
//       </AnimatePresence>

//       {/* Optional 3D Car Viewer */}
//       {/* Uncomment if you want a 3D Spline car instead of emoji */}
//       {/*
//       <Canvas className="absolute top-20 left-0 w-full h-64 pointer-events-none">
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[0, 5, 5]} intensity={1} />
//         <CarModel />
//         <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
//       </Canvas>
//       */}
//     </div>
//   );
// }



// import { motion } from "framer-motion";

// const reasons = [
//   "Your smile makes me smile",
//   "Your voice gives me butterflies",
//   "The way you look at me makes me feel warm",
//   "Your breathing (yes, I’m a creep)",
//   "Your cute little snaps every day",
//   "The fact that you try",
//   "Your weird, ragebaiting sense of humor",
//   "Your ugly face, yes I do love it"
// ];

// export default function ReasonsRoadmap({ onNext }) {
//   return (
//     <div className="h-screen flex flex-col items-center overflow-y-scroll p-10 bg-pink-100">
//       {reasons.map((reason, i) => (
//         <motion.div
//           key={i}
//           className="w-full bg-white rounded p-6 mb-6 shadow text-center"
//           initial={{ opacity: 0, x: -50 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           viewport={{ once: true }}
//         >
//           {reason}
//         </motion.div>
//       ))}
//       <button className="mt-4 px-4 py-2 bg-white rounded" onClick={onNext}>Next</button>
//     </div>
//   );
// }
