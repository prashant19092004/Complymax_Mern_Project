import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import loading from '../../assets/loading.json';
import './style.css';

export default function Loading({width, height}) {
  return (
    <Player
      autoplay
      loop
      src={loading}
      style={{ width: width, height: height }}
      className="custom-lottie-loader"  // Apply custom class here
    />
  );
}
