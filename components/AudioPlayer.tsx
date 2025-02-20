"use client";

import { useEffect, useRef, useState } from "react";

type AudioPlayerProps = {
  audioSrc: string;
  isMuted: boolean;
};

const AudioPlayer = ({ audioSrc, isMuted }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false); // Track if user interacted

  const handleUserInteraction = () => {
    setHasInteracted(true); // Mark interaction as true when user interacts
  };

  useEffect(() => {
    // Add user interaction event listener
    if (!hasInteracted) {
      window.addEventListener("click", handleUserInteraction, { once: true });
      window.addEventListener("touchstart", handleUserInteraction, {
        once: true,
      });
    }

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioSrc;

      // Set mute based on the initial state
      audioRef.current.muted = isMuted;

      if (!hasInteracted) {
        // Autoplay muted audio to allow for autoplay
        audioRef.current.play().catch((err) => {
          console.log("Audio autoplay blocked, user interaction needed", err);
        });
      } else if (!isMuted) {
        // Once interacted and unmuted, play the audio
        audioRef.current.play().catch((err) => {
          console.log("Audio play error", err);
        });
      }
    }
  }, [audioSrc, isMuted, hasInteracted]); // Trigger when audioSrc, mute state, or interaction status change

  return <audio ref={audioRef} className="hidden" controls />;
};

export default AudioPlayer;
