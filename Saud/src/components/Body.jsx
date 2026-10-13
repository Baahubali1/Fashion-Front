import React from "react";
import fashion from "../assets/Woman_walking_down_city_street_20260927164203.mp4";

const Body = ({ onExploreHer, onExploreHim }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden group">

      {/* VIDEO */}
      <video
        src={fashion}
        autoPlay
        muted
        loop
        playsInline
        className="
          absolute inset-0
          w-full h-full
          object-cover
          transition-transform duration-1000
          group-hover:scale-105
        "
      />


      {/* EXPLORE BUTTON */}
      <div
  className="
    absolute bottom-12 left-0 right-0
    flex justify-center gap-16
    opacity-0
    group-hover:opacity-100
    transition-opacity duration-700
  "
>
  <button
    onClick={onExploreHer}
    className="
      text-white
      text-xs
      tracking-[0.3em]
      uppercase
      border-b border-white/60
      pb-2
      hover:border-white
      transition-all duration-500
      cursor-pointer
    "
  >
    Explore Her
  </button>

  <button
    onClick={onExploreHim}
    className="
      text-white
      text-xs
      tracking-[0.3em]
      uppercase
      border-b border-white/60
      pb-2
      hover:border-white
      transition-all duration-500
      cursor-pointer
    "
  >
    Explore Him
    </button>
  </div>
    </div>
  );
};

export default Body;