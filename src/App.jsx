import { useState } from "react";
import LandingPage from "./components/LandingPage";
import GameIntro from "./components/GameIntro";
import HeartsGame from "./components/HeartsGame";
import CakeSection from "./components/CakeSection";
import ReasonsRoadmap from "./components/ReasonsRoadmap";
import PlaylistSection from "./components/PlaylistSection";
import MemoriesSection from "./components/MemoriesSection";
import FinalBanner from "./components/FinalBanner";
import CongratsPage from "./components/CongratsPage";

function App() {
  const [stage, setStage] = useState("landing"); 
  const [heartsCleared, setHeartsCleared] = useState(false);

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Landing page */}
      {stage === "landing" && <LandingPage onContinue={() => setStage("gameIntro")} />}

      {/* Game intro page */}
      {stage === "gameIntro" && <GameIntro onStart={() => setStage("heartsGame")} />}

      {/* Hearts game */}
      {stage === "heartsGame" && (
        <HeartsGame onComplete={() => { setHeartsCleared(true); setStage("congrats"); }} />
      )}

      {/* Congrats page after hearts game */}
      {stage === "congrats" && (
        <CongratsPage onNext={() => setStage("cake")} />
      )}

      {/* Remaining sections */}
      {stage === "cake" && <CakeSection onNext={() => setStage("reasons")} />}
      {stage === "reasons" && <ReasonsRoadmap onNext={() => setStage("playlist")} />}
      {stage === "playlist" && <PlaylistSection onNext={() => setStage("memories")} />}
      {stage === "memories" && <MemoriesSection onNext={() => setStage("final")} />}
      {stage === "final" && <FinalBanner />}
    </div>
  );
}

export default App;





// import React, { useState, useEffect, useRef } from "react";
// import "./index.css";

// export default function App() {
//   const [stage, setStage] = useState("start"); // start, game, wish, granted, love, music, memories, final
//   const [wishGranted, setWishGranted] = useState(false);

//   const audioRef = useRef(null);

//   // Microphone detection for candle blow
//   useEffect(() => {
//     if (stage === "wish") {
//       const handleMic = async () => {
//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//           const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//           const source = audioContext.createMediaStreamSource(stream);
//           const analyser = audioContext.createAnalyser();
//           source.connect(analyser);
//           const data = new Uint8Array(analyser.frequencyBinCount);

//           const checkVolume = () => {
//             analyser.getByteFrequencyData(data);
//             const volume = data.reduce((a, b) => a + b) / data.length;
//             if (volume > 50) { // adjust threshold
//               setWishGranted(true);
//               setStage("granted");
//             } else {
//               requestAnimationFrame(checkVolume);
//             }
//           };
//           checkVolume();
//         } catch (e) {
//           console.log("Mic access denied");
//         }
//       };
//       handleMic();
//     }
//   }, [stage]);

//   // Helper sections
//   const startScreen = (
//     <div className="flex flex-col items-center justify-center h-screen bg-pink-100">
//       <div className="animate-bounce mb-4">✈️</div>
//       <button
//         className="bg-pink-500 text-white px-6 py-3 rounded-xl text-2xl hover:bg-pink-600"
//         onClick={() => setStage("game")}
//       >
//         Open Surprise
//       </button>
//       <div className="mt-6 animate-pulse text-xl">A special birthday awaits 🎉</div>
//     </div>
//   );

//   const gameScreen = (
//     <div className="flex flex-col items-center justify-center h-screen bg-purple-100">
//       <h2 className="text-3xl mb-6">Catch the Hearts 💖</h2>
//       <p className="mb-4">Use arrow keys or tap to move your kitten and catch hearts!</p>
//       {/* Simple clickable hearts simulation */}
//       <button
//         className="bg-pink-500 text-white px-6 py-3 rounded-xl text-2xl hover:bg-pink-600"
//         onClick={() => setStage("wish")}
//       >
//         Continue
//       </button>
//     </div>
//   );

//   const wishScreen = (
//     <div className="flex flex-col items-center justify-center h-screen bg-yellow-100">
//       <h2 className="text-3xl mb-6">Make a Wish 🎂</h2>
//       <div className="relative">
//         <div className="w-32 h-48 bg-pink-300 rounded-t-full flex items-end justify-center relative">
//           <div className="w-4 h-12 bg-orange-500 rounded mx-auto" />
//           <div className="absolute top-0 w-2 h-6 bg-yellow-400 rounded-full animate-pulse" />
//         </div>
//       </div>
//       <p className="mt-4 text-xl">Blow the candle!</p>
//     </div>
//   );

//   const grantedScreen = (
//     <div className="flex flex-col items-center justify-center h-screen bg-green-100 px-4 text-center">
//       <h2 className="text-3xl mb-6">Wish Granted! 🌟</h2>
//       <p className="text-xl">
//         I wish you all the happiness in the world. May all your 11:11 wishes come true. Let's
//         make beautiful memories together. Sending you loads of kisses. Happy birthday, my moon.
//       </p>
//       <button
//         className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-xl text-2xl hover:bg-pink-600"
//         onClick={() => setStage("love")}
//       >
//         Continue
//       </button>
//     </div>
//   );

//   const loveScreen = (
//     <div className="flex flex-col items-center justify-center h-screen bg-purple-50 text-center px-4">
//       <h2 className="text-3xl mb-6">Reasons I Love You ❤️</h2>
//       <ul className="space-y-2 text-xl">
//         <li>Your smile makes me smile</li>
//         <li>Your voice gives me butterflies</li>
//         <li>The way you look at me makes me feel warm</li>
//         <li>Your breathing (yes, I'm a creep)</li>
//         <li>Your cute little snaps everyday</li>
//         <li>The fact that you try</li>
//         <li>Your weird, ragebaiting sense of humor</li>
//         <li>Your ugly face (yes, I do love it)</li>
//       </ul>
//       <button
//         className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-xl text-2xl hover:bg-pink-600"
//         onClick={() => setStage("music")}
//       >
//         Continue
//       </button>
//     </div>
//   );

//   const musicScreen = (
//     <div className="flex flex-col items-center justify-center h-screen bg-blue-50 text-center px-4">
//       <h2 className="text-3xl mb-6">Songs that remind me of you 🎵</h2>
//       <ul className="space-y-2 text-xl">
//         <li>“My love mine all mine” – Because you are my love</li>
//         <li>“The cuppycake song” – For my sugarplum</li>
//         <li>“Smooth Operator” – Do I have to explain?</li>
//         <li>“Melting” – Your voice makes me melt</li>
//         <li>“Hey Lover”</li>
//         <li>“Be My Baby” – Cause you make me happy</li>
//       </ul>
//       <button
//         className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-xl text-2xl hover:bg-pink-600"
//         onClick={() => setStage("memories")}
//       >
//         Continue
//       </button>
//     </div>
//   );

//   const memoriesScreen = (
//     <div className="flex flex-col items-center justify-center h-screen bg-pink-50 px-4 text-center">
//       <h2 className="text-3xl mb-6">Memories 📸</h2>
//       <ul className="grid grid-cols-2 gap-4">
//         <li className="p-2 bg-white rounded shadow">Our first photo together<br/>“If this doesn't scream made for each other, I don't know what does”</li>
//         <li className="p-2 bg-white rounded shadow">Arcade date<br/>“You have no idea how much I regret not kissing you that day”</li>
//         <li className="p-2 bg-white rounded shadow">Green flag<br/>“The greenest red flag I have ever seen”</li>
//         <li className="p-2 bg-white rounded shadow">Dinner date<br/>“You look so cute with my lipstick on you 😉”</li>
//         <li className="p-2 bg-white rounded shadow">Twin?<br/>“Yes, twins”</li>
//         <li className="p-2 bg-white rounded shadow">Placeholder media<br/>“Another special memory”</li>
//       </ul>
//       <button
//         className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-xl text-2xl hover:bg-pink-600"
//         onClick={() => setStage("final")}
//       >
//         Continue
//       </button>
//     </div>
//   );

//   const finalScreen = (
//     <div className="flex flex-col items-center justify-center h-screen bg-purple-100 px-4 text-center">
//       <h2 className="text-3xl mb-6">Happy Birthday Again! 🎉</h2>
//       <p className="text-xl mb-4">
//         Thank you for being the most wonderful person in my life. Every day with you is a gift, and I'm
//         so grateful for all the love, laughter, and beautiful memories we share. You make my world
//         brighter just by being in it!
//       </p>
//       <img src="https://via.placeholder.com/300" alt="Happy Birthday" className="rounded shadow" />
//     </div>
//   );

//   return (
//     <>
//       {stage === "start" && startScreen}
//       {stage === "game" && gameScreen}
//       {stage === "wish" && wishScreen}
//       {stage === "granted" && grantedScreen}
//       {stage === "love" && loveScreen}
//       {stage === "music" && musicScreen}
//       {stage === "memories" && memoriesScreen}
//       {stage === "final" && finalScreen}
//     </>
//   );
// }
