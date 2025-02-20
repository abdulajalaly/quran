"use client";

import { useState, useEffect, useRef } from "react"; // Import useState, useRef, and useEffect

const videoList = [
  "/videos/video (1).mp4",
  "/videos/video (2).mp4",
  "/videos/video (3).mp4",
  "/videos/video (4).mp4",
  "/videos/video (5).mp4",
  "/videos/video (7).mp4",
  "/videos/video (8).mp4",
];

const VideoPlayer = () => {
  const [videoIndex, setVideoIndex] = useState<number>(0);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  // Track if the video is playing
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null); // Ref for next video

  // Set the video index to a random value when the component is first rendered
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * videoList.length);
    setVideoIndex(randomIndex);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleVideoEnd = () => {
    setIsBuffering(true); // Start loading next video
    setVideoIndex((prevIndex) => (prevIndex + 1) % videoList.length); // Go to next video, loop back if necessary
  };

  const handleCanPlay = () => {
    setIsBuffering(false); // Stop loading once the next video is ready to play
    if (videoRef.current) {
      videoRef.current.play(); // Ensure the video plays immediately
    }
  };

  // Preload next video
  useEffect(() => {
    if (nextVideoRef.current) {
      nextVideoRef.current.load();
    }
  }, [videoIndex]);

  return (
    <>
      {/* Main Video */}
      <video
        ref={videoRef}
        key={videoList[videoIndex]} // Change key to update video element on index change
        src={videoList[videoIndex]}
        muted
        autoPlay
        loop={false}
        onEnded={handleVideoEnd}
        onCanPlay={handleCanPlay}
        preload="auto" // Preload current video
        playsInline // Ensure inline play on mobile devices
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Preload Next Video in Background */}
      <video
        ref={nextVideoRef}
        src={videoList[(videoIndex + 1) % videoList.length]} // Load next video in the list
        preload="auto" // Preload next video
        className="hidden" // Hide it, it should not be visible
      />

      {/* Optional: Show buffering overlay */}
      {isBuffering && (
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 flex justify-center items-center">
          <span className="text-white text-xl">Buffering...</span>
        </div>
      )}
    </>
  );
};

export default VideoPlayer;
