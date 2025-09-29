import { useRef, useState, useEffect } from "react";
import { BsFillSkipStartFill, BsFillSkipEndFill } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const PLAYLIST = [
  {
    title: "My Love Mine All Mine",
    artist: "Mitski",
    note: "Because you are my love",
    src: "https://open.spotify.com/embed/track/3vkCueOmm7xQDoJ17W1Pm3?utm_source=generator"
  },
  {
    title: "The Cupcake Song",
    artist: "Amy Castle",
    note: "For my sugarplum",
    src: "https://open.spotify.com/embed/track/5OEGveW1vY5M61QeSjQC9V?utm_source=generator",
  },
  {
    title: "Smooth Operator",
    artist: "Sade",
    note: "Do I have to explain?",
    src: "https://open.spotify.com/embed/track/7pLuEMFougkSHXrPBtNxTR?utm_source=generator",
  },
  {
    title: "Melting",
    artist: "Kali Uchis",
    note: "Your voice makes me melt",
    src: "https://open.spotify.com/embed/track/2kSb3wYSOV996xA2NSmpck?utm_source=generator",
  },
  {
    title: "Hey Lover",
    artist: "LL Cool J",
    note: "Hey there, beautiful",
    src: "https://open.spotify.com/embed/track/0bhwnn2xqnBUcMZDcXNuII?utm_source=generator",
  },
  {
    title: "Be My Baby",
    artist: "The Ronettes",
    note: "Cause you make me happy",
    src: "https://open.spotify.com/embed/track/1WN4uNclrDuczTO3bCr8s1?utm_source=generator",
  },
];

export default function PlaylistSection({ onNext }) {
  const [current, setCurrent] = useState(0);
  const [likedSongs, setLikedSongs] = useState(Array(PLAYLIST.length).fill(false));
  const audioRef = useRef(null);

  // Autoplay whenever current changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked by browser
      });
    }
  }, [current]);

  const toggleLike = (index) => {
    setLikedSongs((prev) => {
      const newLikes = [...prev];
      newLikes[index] = !newLikes[index];
      return newLikes;
    });
  };

  const handlePrev = () => setCurrent((i) => (i === 0 ? PLAYLIST.length - 1 : i - 1));
  const handleNext = () => setCurrent((i) => (i + 1) % PLAYLIST.length);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-purple-900 py-8">
      
      {/* Heading */}
      <div className="mb-6 text-center w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow font-pacifico">
          Songs That Remind Me of You <span className="ml-2">🎵</span>
        </h1>
      </div>

      <div className="w-full max-w-4xl md:flex md:space-x-10 space-y-6 md:space-y-0">

        {/* Main Song Area */}
        <div className="flex-1 bg-purple-800 bg-opacity-30 rounded-3xl shadow-lg flex flex-col items-center p-8 justify-between">
          <div className="mb-6 flex flex-col items-center">
            <div className="rounded-full bg-gradient-to-t from-blue-400 to-purple-400 w-40 h-40 flex items-center justify-center mb-4 overflow-visible">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width={80} height={80} className="animate-pulse">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-2v13"></path>
                <circle cx="6" cy="18" r="3" fill="currentColor"></circle>
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">{PLAYLIST[current].title}</h2>
            <h3 className="text-lg text-fuchsia-200">{PLAYLIST[current].artist}</h3>
            <p className="text-fuchsia-100 italic mt-2">"{PLAYLIST[current].note}"</p>
          </div>

          {/* Spotify Embed */}
          <div className="w-full flex justify-center mb-4">
            <iframe
              src={PLAYLIST[current].src}
              width="300"
              height="80"
              frameBorder="0"
              allowtransparency="true"
              allow="encrypted-media"
              className="rounded-xl"
            ></iframe>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            <button
              className="p-4 rounded-full bg-pink-500 hover:bg-pink-400 text-white"
              onClick={handlePrev}
            >
              <BsFillSkipStartFill size={28} />
            </button>
            <button
              className="p-4 rounded-full bg-pink-500 hover:bg-pink-400 text-white"
              onClick={handleNext}
            >
              <BsFillSkipEndFill size={28} />
            </button>
          </div>
        </div>

        {/* Playlist */}
        <div className="md:w-80 w-full bg-purple-800 bg-opacity-20 rounded-3xl p-6 flex flex-col justify-between">
          <h4 className="text-white font-bold mb-5 text-lg tracking-wide">Our Playlist</h4>
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[360px]">
            {PLAYLIST.map((song, idx) => (
              <div
                key={song.title}
                className={`rounded-xl p-3 flex items-center justify-between shadow-md cursor-pointer
                  ${idx === current
                    ? "bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-300 text-white animate-pulse"
                    : "bg-purple-700 bg-opacity-30 text-fuchsia-300 hover:bg-pink-300 hover:bg-opacity-40 hover:text-white"
                  }`}
                onClick={() => setCurrent(idx)}
              >
                <div className="flex flex-col">
                  <div className="font-semibold">{song.title}</div>
                  <div className="text-xs">{song.artist}</div>
                  <div className="text-fuchsia-50 text-xs italic">"{song.note}"</div>
                </div>
                <div className="flex items-center space-x-2">
                  {idx === current && (
                    <span className="p-1">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v16M19 21V7" />
                      </svg>
                    </span>
                  )}
                  <button onClick={() => toggleLike(idx)}>
                    {likedSongs[idx] ? <AiFillHeart className="text-red-500 text-xl" /> : <AiOutlineHeart className="text-white text-xl" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add songs & Continue */}
          <div className="mt-4 flex flex-col items-center space-y-2">
            <a
              href="https://open.spotify.com/playlist/6UcjotNKTrIa5MZBEWjIfA?si=lQm81on8Q5C_CN2gJer_uA&pi=Jf_3oGJXQ1y-n"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-pink-300 underline hover:text-pink-200 text-center"
            >
              Add songs to the playlist
            </a>
            <button
              onClick={onNext}
              className="bg-fuchsia-300 text-purple-900 font-semibold py-2 px-4 rounded-xl hover:bg-fuchsia-200 shadow transition"
            >
              Continue to Memories ✨
            </button>
          </div>
        </div>
      </div>

      {/* Include audio element for autoplay */}
      <audio ref={audioRef} src={PLAYLIST[current].src} autoPlay />
    </div>
  );
}



// import { useState } from "react";
// import {
//   BsFillSkipStartFill,
//   BsFillSkipEndFill,
// } from "react-icons/bs";
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

// const PLAYLIST = [
//   {
//     title: "My Love Mine All Mine",
//     artist: "Mitski",
//     note: "Because you are my love",
//     src: "https://open.spotify.com/embed/track/3vkCueOmm7xQDoJ17W1Pm3?utm_source=generator"
//   },
//   {
//     title: "The Cupcake Song",
//     artist: "Amy Castle",
//     note: "For my sugarplum",
//     src: "https://open.spotify.com/embed/track/5OEGveW1vY5M61QeSjQC9V?utm_source=generator",
//   },
//   {
//     title: "Smooth Operator",
//     artist: "Sade",
//     note: "Do I have to explain?",
//     src: "https://open.spotify.com/embed/track/7pLuEMFougkSHXrPBtNxTR?utm_source=generator",
//   },
//   {
//     title: "Melting",
//     artist: "Kali Uchis",
//     note: "Your voice makes me melt",
//     src: "https://open.spotify.com/embed/track/2kSb3wYSOV996xA2NSmpck?utm_source=generator",
//   },
//   {
//     title: "Hey Lover",
//     artist: "LL Cool J",
//     note: "Hey there, beautiful",
//     src: "https://open.spotify.com/embed/track/0bhwnn2xqnBUcMZDcXNuII?utm_source=generator",
//   },
//   {
//     title: "Be My Baby",
//     artist: "The Ronettes",
//     note: "Cause you make me happy",
//     src: "https://open.spotify.com/embed/track/1WN4uNclrDuczTO3bCr8s1?utm_source=generator",
//   },
// ];

// export default function PlaylistSection({ onNext }) {
//   const [current, setCurrent] = useState(0);
//   const [likedSongs, setLikedSongs] = useState(Array(PLAYLIST.length).fill(false));

//   const toggleLike = (index) => {
//     setLikedSongs((prev) => {
//       const newLikes = [...prev];
//       newLikes[index] = !newLikes[index];
//       return newLikes;
//     });
//   };

//   const handlePrev = () => setCurrent((i) => (i === 0 ? PLAYLIST.length - 1 : i - 1));
//   const handleNext = () => setCurrent((i) => (i + 1) % PLAYLIST.length);

//   return (
//     <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-purple-900 py-8">

//       {/* Heading */}
//       <div className="mb-6 text-center w-full max-w-2xl">
//         <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow">
//           Songs That Remind Me of You <span className="ml-2">🎵</span>
//         </h1>
//       </div>

//       <div className="w-full max-w-4xl md:flex md:space-x-10 space-y-6 md:space-y-0">

//         {/* Main Song Area */}
//         <div className="flex-1 bg-purple-800 bg-opacity-30 rounded-3xl shadow-lg flex flex-col items-center p-8 justify-between">
//           <div className="mb-6 flex flex-col items-center">
//             <div className="rounded-full bg-gradient-to-t from-blue-400 to-purple-400 w-32 h-32 flex items-center justify-center mb-4 overflow-visible">
//               <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width={64} height={64} className="animate-pulse">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-2v13"></path>
//                 <circle cx="6" cy="18" r="3" fill="currentColor"></circle>
//               </svg>
//             </div>
//             <h2 className="text-xl md:text-2xl font-bold text-white">{PLAYLIST[current].title}</h2>
//             <h3 className="text-lg text-fuchsia-200">{PLAYLIST[current].artist}</h3>
//             <p className="text-fuchsia-100 italic mt-2">"{PLAYLIST[current].note}"</p>
//           </div>

//           {/* Spotify Embed */}
//           <div className="w-full flex justify-center mb-4">
//             <iframe
//               src={PLAYLIST[current].src}
//               width="300"
//               height="80"
//               frameBorder="0"
//               allowtransparency="true"
//               allow="encrypted-media"
//               className="rounded-xl"
//             ></iframe>
//           </div>

//           {/* Controls */}
//           <div className="flex items-center space-x-3">
//             <button
//               className="p-2 rounded-full bg-pink-500 hover:bg-pink-400 text-white"
//               onClick={handlePrev}
//               aria-label="Previous"
//             >
//               <BsFillSkipStartFill size={28} />
//             </button>
//             <button
//               className="p-4 rounded-full bg-fuchsia-400 hover:bg-pink-500 text-white text-3xl"
//               onClick={handleNext}
//               aria-label="Next"
//             >
//               ➡️
//             </button>
//           </div>
//         </div>

//         {/* Playlist */}
//         <div className="md:w-80 w-full bg-purple-800 bg-opacity-20 rounded-3xl p-6 flex flex-col justify-between">
//           <h4 className="text-white font-bold mb-5 text-lg tracking-wide">Our Playlist</h4>
//           <div className="flex-1 overflow-y-auto space-y-4 max-h-[360px]">
//             {PLAYLIST.map((song, idx) => (
//               <div
//                 key={song.title}
//                 className={`rounded-xl p-3 flex items-center justify-between shadow-md cursor-pointer
//                   ${idx === current
//                     ? "bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-300 text-white animate-pulse"
//                     : "bg-purple-700 bg-opacity-30 text-fuchsia-300 hover:bg-pink-300 hover:bg-opacity-40 hover:text-white"
//                   }`}
//                 onClick={() => setCurrent(idx)}
//               >
//                 <div className="flex flex-col">
//                   <div className="font-semibold">{song.title}</div>
//                   <div className="text-xs">{song.artist}</div>
//                   <div className="text-fuchsia-50 text-xs italic">"{song.note}"</div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   {idx === current && (
//                     <span className="p-1">
//                       <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v16M19 21V7" />
//                       </svg>
//                     </span>
//                   )}
//                   <button onClick={() => toggleLike(idx)}>
//                     {likedSongs[idx] ? <AiFillHeart className="text-red-500 text-xl" /> : <AiOutlineHeart className="text-white text-xl" />}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Add songs link & Continue */}
//           <div className="mt-4 flex flex-col items-center space-y-2">
//             <a
//               href="https://open.spotify.com/playlist/yourplaylistid"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-sm text-pink-300 underline hover:text-pink-200 text-center"
//             >
//               Add songs to the playlist
//             </a>
//             <button
//               onClick={onNext}
//               className="bg-fuchsia-300 text-purple-900 font-semibold py-2 px-4 rounded-xl hover:bg-fuchsia-200 shadow transition"
//             >
//               Continue to Memories ✨
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






// import { useRef, useState, useEffect } from "react";
// import {
//   BsFillPlayFill,
//   BsFillPauseFill,
//   BsFillSkipStartFill,
//   BsFillSkipEndFill,
// } from "react-icons/bs";

// const PLAYLIST = [
//   {
//     title: "My Love Mine All Mine",
//     artist: "Mitski",
//     note: "Because you are my love",
//     src: "/audio/song1.mp3",
//   },
//   {
//     title: "The Cupcake Song",
//     artist: "Amy Castle",
//     note: "For my sugarplum",
//     src: "/audio/song2.mp3",
//   },
//   {
//     title: "Smooth Operator",
//     artist: "Sade",
//     note: "Do I have to explain?",
//     src: "/audio/song3.mp3",
//   },
//   {
//     title: "Melting",
//     artist: "Kali Uchis",
//     note: "Your voice makes me melt",
//     src: "/audio/song4.mp3",
//   },
//   {
//     title: "Hey Lover",
//     artist: "LL Cool J",
//     note: "Hey there, beautiful",
//     src: "/audio/song5.mp3",
//   },
//   {
//     title: "Be My Baby",
//     artist: "The Ronettes",
//     note: "Cause you make me happy",
//     src: "/audio/song6.mp3",
//   },
// ];

// export default function PlaylistSection({ onNext }) {
//   const [current, setCurrent] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [progress, setProgress] = useState(0);
//   const audioRef = useRef(null);

//   // Auto play on song load
//   useEffect(() => {
//     if (audioRef.current) {
//       if (isPlaying) audioRef.current.play();
//       else audioRef.current.pause();
//     }
//   }, [current, isPlaying]);

//   // Progress bar updater
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const handleTimeUpdate = () =>
//       setProgress((audio.currentTime / audio.duration) * 100 || 0);
//     audio.addEventListener("timeupdate", handleTimeUpdate);
//     audio.addEventListener("ended", handleNext);

//     return () => {
//       audio.removeEventListener("timeupdate", handleTimeUpdate);
//       audio.removeEventListener("ended", handleNext);
//     };
//     // eslint-disable-next-line
//   }, [current]);

//   const handlePlayPause = () => setIsPlaying((val) => !val);
//   const handlePrev = () =>
//     setCurrent((i) => (i === 0 ? PLAYLIST.length - 1 : i - 1));
//   const handleNext = () => setCurrent((i) => (i + 1) % PLAYLIST.length);

//   return (
//     <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-purple-900 py-8">
      
//       {/* Playlist heading at the top */}
//       <div className="mb-6 text-center w-full max-w-2xl">
//         <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow">
//           Songs That Remind Me of You <span className="ml-2">🎵</span>
//         </h1>
//         <p className="text-fuchsia-100 text-base mt-2">
//           Every melody tells our story
//         </p>
//       </div>

//       <div className="w-full max-w-4xl md:flex md:space-x-10 space-y-6 md:space-y-0">
//         {/* Main Song Area */}
//         <div className="flex-1 bg-purple-800 bg-opacity-30 rounded-3xl shadow-lg flex flex-col items-center p-8 justify-between">
//           <div className="mb-6 flex flex-col items-center">
//             <div className="rounded-full bg-gradient-to-t from-blue-400 to-purple-400 w-28 h-28 flex items-center justify-center mb-4">
//               <span className="text-white text-5xl">
//                 <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width={48} height={48}>
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-2v13"></path>
//                   <circle cx="6" cy="18" r="3" fill="currentColor"></circle>
//                 </svg>
//               </span>
//             </div>
//             <h2 className="text-xl md:text-2xl font-bold text-white">{PLAYLIST[current].title}</h2>
//             <h3 className="text-lg text-fuchsia-200">{PLAYLIST[current].artist}</h3>
//             <p className="text-fuchsia-100 italic mt-2">"{PLAYLIST[current].note}"</p>
//           </div>

//           {/* Controls */}
//           <div className="w-full flex flex-col items-center space-y-4">
//             <audio
//               ref={audioRef}
//               src={PLAYLIST[current].src}
//               autoPlay
//             />
//             {/* Progress bar */}
//             <div className="w-full h-2 bg-fuchsia-300 bg-opacity-30 rounded-lg overflow-hidden mb-2">
//               <div
//                 className="h-2 bg-pink-400 transition-all duration-300"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//             {/* Buttons */}
//             <div className="flex items-center space-x-3">
//               <button
//                 className="p-2 rounded-full bg-pink-500 hover:bg-pink-400 text-white"
//                 onClick={handlePrev}
//                 aria-label="Previous"
//               >
//                 <BsFillSkipStartFill size={28} />
//               </button>
//               <button
//                 className="p-4 rounded-full bg-fuchsia-400 hover:bg-pink-500 text-white text-3xl"
//                 onClick={handlePlayPause}
//                 aria-label={isPlaying ? "Pause" : "Play"}
//               >
//                 {isPlaying ? <BsFillPauseFill /> : <BsFillPlayFill />}
//               </button>
//               <button
//                 className="p-2 rounded-full bg-pink-500 hover:bg-pink-400 text-white"
//                 onClick={handleNext}
//                 aria-label="Next"
//               >
//                 <BsFillSkipEndFill size={28} />
//               </button>
//             </div>
//             <div className="text-xs mt-1 text-fuchsia-300">
//               {`${Math.floor((audioRef.current?.currentTime || 0) / 60)}:${String(Math.floor((audioRef.current?.currentTime || 0) % 60)).padStart(2, '0')}
//                 /
//                 ${Math.floor((audioRef.current?.duration || 0) / 60)}:${String(Math.floor((audioRef.current?.duration || 0) % 60)).padStart(2, '0')}`}
//             </div>
//           </div>
//         </div>

//         {/* Playlist */}
//         <div className="md:w-80 w-full bg-purple-800 bg-opacity-20 rounded-3xl p-6 flex flex-col justify-between">
//           <h4 className="text-white font-bold mb-5 text-lg tracking-wide">Our Playlist</h4>
//           <div className="flex-1 overflow-y-auto space-y-6">
//             {PLAYLIST.map((song, idx) => (
//               <div
//                 key={song.title}
//                 className={`rounded-xl p-3 flex flex-col shadow-md cursor-pointer
//                   ${idx === current
//                     ? "bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-300 text-white"
//                     : "bg-purple-700 bg-opacity-30 text-fuchsia-300 hover:bg-pink-300 hover:bg-opacity-40 hover:text-white"
//                   }`}
//                 onClick={() => { setCurrent(idx); setIsPlaying(true); }}
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="font-semibold">{song.title}</div>
//                     <div className="text-xs">{song.artist}</div>
//                   </div>
//                   {idx === current && (
//                     <span className="ml-2 p-1 bg-white/20 rounded-full">
//                       <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v16M19 21V7" />
//                       </svg>
//                     </span>
//                   )}
//                 </div>
//                 <div className="text-fuchsia-50 text-xs mt-1 italic">
//                   "{song.note}"
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Add songs link & Continue button */}
//           <div className="mt-6 flex flex-col space-y-2">
//             <a
//               href="https://open.spotify.com/playlist/yourplaylistid"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-sm text-pink-300 underline hover:text-pink-200"
//             >
//               Add songs to the playlist
//             </a>
//             <button
//               onClick={onNext}
//               className="bg-fuchsia-300 text-purple-900 font-semibold py-2 px-4 rounded-xl hover:bg-fuchsia-200 shadow transition"
//             >
//               Continue to Memories ✨
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useRef } from "react";

// const songs = [
//   { src: "https://open.spotify.com/embed/track/1", title: "My love mine all mine", caption: "Because you are my love" },
//   { src: "https://open.spotify.com/embed/track/2", title: "The cuppycake song", caption: "For my sugarplum" },
//   { src: "https://open.spotify.com/embed/track/3", title: "Smooth Operator", caption: "Do I have to explain?" },
//   { src: "https://open.spotify.com/embed/track/4", title: "Melting", caption: "Your voice makes me melt" },
//   { src: "https://open.spotify.com/embed/track/5", title: "Hey Lover", caption: "" },
//   { src: "https://open.spotify.com/embed/track/6", title: "Be My Baby", caption: "Cause you make me happy" },
// ];

// export default function PlaylistSection({ onNext }) {
//   const iframes = useRef([]);

//   useEffect(() => {
//     // Autoplay logic can be browser dependent; Spotify iframe may not autoplay due to browser restrictions
//     // You can trigger play manually if needed
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-10">
//       <h2 className="text-2xl font-bold mb-6">Songs that remind me of you</h2>
//       {songs.map((song, i) => (
//         <div key={i} className="mb-6 w-full max-w-xl">
//           <iframe
//             ref={(el) => (iframes.current[i] = el)}
//             src={song.src}
//             width="100%"
//             height="80"
//             allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
//             className="rounded"
//             title={song.title}
//           ></iframe>
//           <p className="mt-2 text-center text-sm font-medium">{song.caption}</p>
//         </div>
//       ))}
//       <button className="mt-4 px-4 py-2 bg-white rounded" onClick={onNext}>Next</button>
//     </div>
//   );
// }
