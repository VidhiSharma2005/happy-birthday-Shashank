import { useState } from "react";

// Use placeholder or your own image links
const PLACEHOLDER = "https://via.placeholder.com/400x300?text=Memory";
const MEMORIES = [
  { type: "photo", src: "src/assets/First.png", title: "Our First Photo Together", note: "If this doesn't scream made for each other, I don't know what does" },
  { type: "photo", src: "src/assets/arcade.png", title: "Arcade Date", note: "I need a rematch" },
  { type: "video", src: "src/assets/GreenFlag.mp4", title: "Green Flag", note: "The greenest red flag I have ever seen" },
  { type: "photo", src: "src/assets/lipstickKiss.png", title: "Lipstick Marks", note: "You look so cute with my lipstick on you 😉" },
  { type: "photo", src: "src/assets/DinnerDate.png", title: "Dinner Date", note: "You have no idea how much I regret not kissing you that day" },
  { type: "video", src: "src/assets/Twin.mp4", title: "Twins?", note: "Same same but different." },
  
];

const CameraIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
    <rect x="3" y="7" width="18" height="13" rx="4" className="stroke-current" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" className="stroke-current" />
    <circle cx="12" cy="14" r="3" className="stroke-current" />
  </svg>
);

function FlipPhotoboothCard({ memory, flipped, onFlip }) {
  return (
    <div
      style={{ perspective: "1200px" }}
      className="w-full md:w-[460px] h-[360px] flex items-center justify-center cursor-pointer"
      onClick={onFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className="[backface-visibility:hidden] absolute w-full h-full flex flex-col justify-center bg-pink-100 border-8 border-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="w-full flex-1 overflow-hidden rounded-xl flex items-center justify-center bg-white">
            {memory.type === "photo" ? (
              <img
                src={memory.src}
                alt={memory.title}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                src={memory.src}
                className="max-w-full max-h-full"
                autoPlay
                loop
                muted
                controls
              />
            )}
          </div>
          <div className="flex flex-col items-center justify-center bg-white py-2">
            <CameraIcon className="h-6 w-6 text-pink-400" />
            <div className="text-sm font-semibold text-pink-600 mt-1">{memory.title}</div>
            <div className="text-xs text-gray-600">Click to reveal a love note</div>
          </div>
        </div>

        {/* Back */}
        <div
          className="[backface-visibility:hidden] absolute w-full h-full flex flex-col items-center justify-center bg-fuchsia-100 border-8 border-white rounded-3xl shadow-2xl p-6 text-center"
          style={{ transform: "rotateY(180deg)" }}
        >
          <span className="text-pink-500 font-extrabold text-3xl mb-4">💌</span>
          <div className="font-semibold text-xl text-fuchsia-700 mb-2">{memory.title}</div>
          <div className="text-fuchsia-900">{memory.note}</div>
        </div>
      </div>
    </div>
  );
}

export default function MemoriesSection({ onNext }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const prevMemory = () => {
    setCurrent((i) => (i === 0 ? MEMORIES.length - 1 : i - 1));
    setFlipped(false);
  };
  const nextMemory = () => {
    setCurrent((i) => (i === MEMORIES.length - 1 ? 0 : i + 1));
    setFlipped(false);
  };

  return (
    <section className="bg-pink-50 min-h-screen py-12 flex flex-col items-center justify-center">
      <CameraIcon className="w-14 h-14 text-pink-400 mb-2" />
      <h2
        className="text-4xl md:text-5xl font-bold text-pink-600 mb-2 text-center"
        style={{ fontFamily: "'Pacifico', cursive" }}
      >
        Our Memories
      </h2>
      <div className="text-gray-700 text-lg mb-10 text-center max-w-xl">
        Precious moments captured forever
      </div>

      {/* Pink frame with arrows */}
      <div className="w-full flex justify-center mb-6">
        <div className="bg-pink-200 rounded-3xl shadow-lg w-full max-w-5xl flex items-center px-3 py-10">
          <button
            className="flex-shrink-0 mr-2 md:mr-6 w-12 h-12 bg-white shadow border rounded-full flex items-center justify-center hover:bg-pink-50 transition"
            onClick={prevMemory}
          >
            <svg width={24} height={24}><path d="M15 6l-6 6 6 6" stroke="#f472b6" strokeWidth={3} fill="none"/></svg>
          </button>

          <div className="flex-1 flex justify-center">
            <FlipPhotoboothCard
              memory={MEMORIES[current]}
              flipped={flipped}
              onFlip={() => setFlipped((f) => !f)}
            />
          </div>

          <button
            className="flex-shrink-0 ml-2 md:ml-6 w-12 h-12 bg-white shadow border rounded-full flex items-center justify-center hover:bg-pink-50 transition"
            onClick={nextMemory}
          >
            <svg width={24} height={24}><path d="M9 6l6 6-6 6" stroke="#f472b6" strokeWidth={3} fill="none"/></svg>
          </button>
        </div>
      </div>

      {/* Index and thumbnails */}
      <div className="mt-6 text-center">
        <div className="text-2xl font-bold text-gray-800">{MEMORIES[current].title}</div>
        <div className="text-yellow-700 text-sm italic">✧ Click the photo to reveal a love note!</div>
      </div>

      <div className="flex gap-4 mt-8 flex-wrap justify-center">
        {MEMORIES.map((m, idx) => (
          <button
            key={idx}
            className={`w-24 h-24 rounded-xl border-4 shadow transition-all ${
              idx === current ? "border-pink-500 scale-105" : "border-pink-200"
            }`}
            onClick={() => {
              setCurrent(idx);
              setFlipped(false);
            }}
          >
            {m.type === "photo" ? (
              <img src={m.src} alt={m.title} className="w-full h-full object-contain rounded-lg" />
            ) : (
              <video src={m.src} className="w-full h-full object-contain rounded-lg" muted />
            )}
          </button>
        ))}
      </div>

      <div className="mt-2 text-pink-600 font-semibold">
        {current + 1} of {MEMORIES.length}
      </div>

      <button
        onClick={onNext}
        className="mt-10 bg-pink-400 text-white font-semibold py-2 px-6 rounded-xl shadow hover:bg-pink-300 transition"
      >
        Go to the Final Section ✨
      </button>
    </section>
  );
}






/* Add this CSS (can be global.css or inside a <style jsx global> tag for Next.js)
.perspective { perspective: 1200px; }
.rotate-y-180 { transform: rotateY(180deg); }
.backface-hidden { backface-visibility: hidden; }
*/

/* For best match:
1. Download 'Pacifico' or another cute font from Google Fonts, link in html.
2. Replace '/images/...' and '/videos/...' with your real paths.
3. To make the video thumbnail as 'thumb', export a JPEG from the video.
4. The card, border, and button styles will ensure both photobooth and flip functionality.
*/

// import { useState } from "react";

// // Replace with real images/videos in your assets
// const MEMORIES = [
//   {
//     id: 1,
//     type: "photo",
//     title: "Our First Photo Together",
//     src: "/images/photo1.jpg", // replace with your image url
//     loveNote: "If this doesn't scream made for each other, I don't know what does",
//     desc: "That awkward but perfect first picture",
//   },
//   {
//     id: 2,
//     type: "video",
//     title: "Arcade Date",
//     src: "/videos/arcade.mp4", // replace with your video url
//     loveNote: "First couple selfie with shy smiles",
//     desc: "Click the photo to reveal a love note!",
//   },
//   {
//     id: 3,
//     type: "photo",
//     title: "Dinner Date",
//     src: "/images/photo2.jpg",
//     loveNote: "You have no idea how much I regret not kissing you that day",
//     desc: "",
//   },
//   {
//     id: 4,
//     type: "photo",
//     title: "Green Flag",
//     src: "/images/photo3.jpg",
//     loveNote: "The greenest red flag I have ever seen",
//     desc: "",
//   },
//   {
//     id: 5,
//     type: "photo",
//     title: "Lipstick Kiss",
//     src: "/images/photo4.jpg",
//     loveNote: "You look so cute with my lipstick on you 😉",
//     desc: "",
//   },
//   {
//     id: 6,
//     type: "video",
//     title: "Twin Moment",
//     src: "/videos/twin.mp4",
//     loveNote: "Twin?",
//     desc: "",
//   }
// ];

// function FlipCard({ memory, flipped, onFlip }) {
//   return (
//     <div className="perspective h-64 w-full flex items-center justify-center select-none cursor-pointer">
//       <div
//         className={`relative w-full h-64 transition-transform duration-700 transform 
//           ${flipped ? "rotate-y-180" : ""}`}
//         style={{
//           transformStyle: "preserve-3d",
//         }}
//         onClick={onFlip}
//       >
//         {/* Front face */}
//         <div className="absolute w-full h-full backface-hidden rounded-3xl shadow-lg bg-pink-200 flex items-center justify-center">
//           {memory.type === "photo" ? (
//             <img src={memory.src} alt={memory.title} className="object-cover w-full h-full rounded-3xl" />
//           ) : (
//             <video src={memory.src} controls={false} autoPlay loop muted className="object-cover w-full h-full rounded-3xl" />
//           )}
//           <div className="absolute inset-0 bg-pink-200 bg-opacity-80 rounded-3xl flex flex-col items-center justify-center">
//             <span className="text-3xl text-pink-600 mb-2"><svg width={32} height={32}><circle cx="16" cy="16" r="14" stroke="pink" strokeWidth="4" fill="none" /></svg></span>
//             <span className="font-medium text-pink-900 text-lg">{memory.desc || memory.title}</span>
//           </div>
//         </div>
//         {/* Back face */}
//         <div
//           className="absolute w-full h-full backface-hidden rounded-3xl bg-fuchsia-100 shadow-lg flex flex-col items-center justify-center px-4"
//           style={{
//             transform: "rotateY(180deg)",
//           }}
//         >
//           <span className="font-bold text-lg text-fuchsia-700 mb-2">Love Note</span>
//           <span className="text-fuchsia-900 text-center text-base">{memory.loveNote}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function MemoriesSection() {
//   const [current, setCurrent] = useState(0);
//   const [flipped, setFlipped] = useState(false);

//   const handlePrev = () => {
//     setFlipped(false);
//     setCurrent((i) => (i === 0 ? MEMORIES.length - 1 : i - 1));
//   };

//   const handleNext = () => {
//     setFlipped(false);
//     setCurrent((i) => (i === MEMORIES.length - 1 ? 0 : i + 1));
//   };

//   return (
//     <section className="w-full bg-pink-50 py-10 flex flex-col items-center justify-center">
//       {/* Heading */}
//       <div className="text-center mb-8">
//         <span className="text-4xl font-extrabold text-red-600">Our Beautiful Memories</span>
//         <span className="inline-block ml-2 text-purple-600 text-4xl align-middle"><svg width={32} height={32}><rect x="2" y="10" width="28" height="18" rx="4" fill="purple" /></svg></span>
//         <p className="mt-2 text-gray-700 font-medium">Precious moments captured forever - click each memory to reveal a love note</p>
//       </div>
//       {/* Slider */}
//       <div className="flex flex-col items-center mb-6 w-full max-w-2xl">
//         <div className="w-full relative">
//           <button
//             onClick={handlePrev}
//             className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg border text-pink-400 z-10"
//             aria-label="Previous"
//           >
//             <svg width={24} height={24}><path d="M16 4l-8 8 8 8" stroke="pink" strokeWidth="3" fill="none"/></svg>
//           </button>
//           <FlipCard
//             memory={MEMORIES[current]}
//             flipped={flipped}
//             onFlip={() => setFlipped((f) => !f)}
//           />
//           <button
//             onClick={handleNext}
//             className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg border text-pink-400 z-10"
//             aria-label="Next"
//           >
//             <svg width={24} height={24}><path d="M8 4l8 8-8 8" stroke="pink" strokeWidth="3" fill="none"/></svg>
//           </button>
//         </div>
//         {/* Caption */}
//         <div className="text-center mt-4">
//           <h2 className="text-2xl font-bold text-gray-800">{MEMORIES[current].title}</h2>
//           <div className="text-gray-500 mb-1">{MEMORIES[current].desc}</div>
//           <div className="text-pink-700 text-sm">Click the photo to reveal a love note!</div>
//         </div>
//       </div>
//       {/* Gallery memory nav */}
//       <div className="w-full max-w-2xl flex flex-col items-center">
//         <h3 className="text-center text-lg font-bold text-gray-700 mb-4">All Our Memories</h3>
//         <div className="flex flex-wrap justify-center gap-4 mb-3">
//           {MEMORIES.map((m, i) => (
//             <button
//               key={m.id}
//               onClick={() => { setCurrent(i); setFlipped(false); }}
//               className={`w-36 h-24 rounded-2xl shadow-md flex flex-col items-center justify-center
//                 ${i === current ? "border-2 border-pink-600 bg-pink-100" : "bg-pink-200 hover:bg-pink-300"}
//                 transition group`}
//             >
//               <span className="mb-1 text-pink-500">{m.type === "photo"
//                 ? <svg width={24} height={24}><circle cx="12" cy="12" r="10" stroke="pink" strokeWidth="3" fill="none" /></svg>
//                 : <svg width={24} height={24}><polygon points="4,4 20,12 4,20" fill="pink" /></svg>
//               }</span>
//               <span className="text-xs text-pink-900 font-semibold text-center">{m.title}</span>
//             </button>
//           ))}
//         </div>
//         {/* Pagination */}
//         <div className="flex items-center mb-5">
//           <button
//             className="p-2 rounded-full bg-pink-300"
//             onClick={handlePrev}
//           ><svg width={18} height={18}><path d="M12 4l-6 5 6 5" stroke="white" strokeWidth="2" fill="none"/></svg></button>
//           <span className="mx-3 text-pink-700">{current + 1} of {MEMORIES.length}</span>
//           <button
//             className="p-2 rounded-full bg-pink-300"
//             onClick={handleNext}
//           ><svg width={18} height={18}><path d="M6 4l6 5-6 5" stroke="white" strokeWidth="2" fill="none"/></svg></button>
//         </div>
//         {/* Final Button */}
//         <button className="w-full max-w-sm mx-auto bg-gradient-to-r from-pink-400 to-fuchsia-500 text-white font-bold rounded-2xl py-3 shadow-lg text-lg transition hover:from-pink-500 hover:to-fuchsia-600">
//           Final Surprise Awaits! ✨
//         </button>
//       </div>
//     </section>
//   );
// }

/* Tailwind classes for flip card (add to your styles/global.css if necessary)
.perspective { perspective: 1200px; }
.rotate-y-180 { transform: rotateY(180deg); }
.backface-hidden { backface-visibility: hidden; }
*/

// import { useState } from "react";
// import { motion } from "framer-motion";

// const memories = [
//   { type: "photo", src: "photo1.jpg", note: "Our first photo together: If this doesn't scream made for each other, I don't know what does" },
//   { type: "photo", src: "photo2.jpg", note: "Arcade date" },
//   { type: "photo", src: "photo3.jpg", note: "Dinner date: You have no idea how much I regret not kissing you that day" },
//   { type: "video", src: "video1.mp4", note: "Green flag: The greenest red flag I have ever seen" },
//   { type: "video", src: "video2.mp4", note: "You look so cute with my lipstick on you 😉" },
//   { type: "photo", src: "photo4.jpg", note: "Twin?" }
// ];

// export default function MemoriesSection({ onNext }) {
//   const [flipped, setFlipped] = useState(Array(memories.length).fill(false));

//   const handleFlip = (index) => {
//     const newFlipped = [...flipped];
//     newFlipped[index] = !newFlipped[index];
//     setFlipped(newFlipped);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100 p-10 space-y-6">
//       <h2 className="text-2xl font-bold mb-6">Memories</h2>
//       <div className="grid md:grid-cols-2 gap-6">
//         {memories.map((mem, i) => (
//           <motion.div
//             key={i}
//             className="w-72 h-48 bg-white rounded-lg shadow-lg cursor-pointer relative overflow-hidden"
//             onClick={() => handleFlip(i)}
//             whileHover={{ scale: 1.05 }}
//           >
//             {!flipped[i] ? (
//               mem.type === "photo" ? (
//                 <img src={mem.src} alt={`memory-${i}`} className="w-full h-full object-cover" />
//               ) : (
//                 <video src={mem.src} className="w-full h-full object-cover" autoPlay loop muted />
//               )
//             ) : (
//               <div className="flex items-center justify-center h-full text-center p-4">
//                 <p className="text-sm font-medium">{mem.note}</p>
//               </div>
//             )}
//           </motion.div>
//         ))}
//       </div>
//       <button className="mt-4 px-4 py-2 bg-white rounded" onClick={onNext}>Next</button>
//     </div>
//   );
// }
