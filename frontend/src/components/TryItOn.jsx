import React, { useEffect, useRef, useState } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import html2canvas from "html2canvas";
import axios from "axios";
import { toast } from "react-toastify";
import Webcam from "react-webcam";
import {
  FaCamera,
  FaRegClock,
  FaEnvelope,
  FaWhatsapp,
  FaImage,
  FaStar,
} from "react-icons/fa";
import "./TryItOn.css";

const scrubOptions = ["dopamine_hit", "just_bee_you", "espresso_yourself"];
const preloadedImages = {};
const selectedScrubRef = { current: null };

const TryItOn = () => {
  const [mode, setMode] = useState("webcam");
  const [overlayImage, setOverlayImage] = useState(null);
  const [selectedScrub, setSelectedScrub] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [email, setEmail] = useState("");
  const [shareUrl, setShareUrl] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);

  const webcamRef = useRef({ video: null });
  const canvasRef = useRef(null);
  const uploadCanvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    scrubOptions.forEach((scrub) => {
      const img = new Image();
      img.src = `/overlays/${scrub}.png`;
      preloadedImages[scrub] = img;
    });
  }, []);

  useEffect(() => {
    selectedScrubRef.current = selectedScrub;
    window.skinToneDetectedOnce = false;
    setOverlayImage(preloadedImages[selectedScrub]);
    if (mode === "upload" && uploadedImage && selectedScrub) {
      drawOnUpload(uploadedImage);
    }
  }, [selectedScrub]);

  useEffect(() => {
    if (mode !== "webcam" || !webcamRef.current.video || !selectedScrub) return;

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(draw);

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        try {
          await pose.send({ image: webcamRef.current.video });
        } catch (err) {
          console.error("Pose detection error:", err);
          notifyBackendError("Pose Detection Error", err.message);
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();
  }, [mode, selectedScrub]);

  const notifyBackendError = async (type, message) => {
    try {
      await axios.post("http://localhost:5050/report-error", {
        error_type: type,
        error_message: message,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error reporting failed:", err);
    }
  };

  const sendScreenshotToBackendForToneDetection = async () => {
    const canvas = mode === "webcam" ? canvasRef.current : uploadCanvasRef.current;
    if (!canvas) return;
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

    const formData = new FormData();
    formData.append("image", blob, "screenshot.png");

    try {
      const res = await axios.post("http://localhost:5050/detect-skin-tone", formData);
      console.log("[SKIN TONE DETECTED]", res.data);
    } catch (error) {
      console.error("[SKIN TONE DETECTION ERROR]", error);
    }
  };

  const draw = (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = webcamRef.current.video;

    if (!video || !results.image) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    const scrubImg = preloadedImages[selectedScrubRef.current];
    if (results.poseLandmarks && scrubImg) {
      try {
        const left = results.poseLandmarks[11];
        const right = results.poseLandmarks[12];
        const shoulderWidth = Math.abs(right.x - left.x) * canvas.width;
        const width = shoulderWidth * 2.0;
        const height = scrubImg.height * (width / scrubImg.width);
        const centerX = ((left.x + right.x) / 2) * canvas.width;
        const shoulderY = (left.y + right.y) / 2;
        const topY = shoulderY * canvas.height - height * 0.25;
        ctx.drawImage(scrubImg, centerX - width / 2, topY, width, height);

        if (!window.skinToneDetectedOnce) {
          window.skinToneDetectedOnce = true;
          sendScreenshotToBackendForToneDetection();
        }
      } catch (err) {
        console.error("Overlay error:", err);
        notifyBackendError("Overlay Drawing Error", err.message);
      }
    }
  };

  const drawOnUpload = async (imageUrl) => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const img = new Image();
    img.src = imageUrl;
    await img.decode();

    const canvas = uploadCanvasRef.current;
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    pose.onResults((results) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const scrubImg = preloadedImages[selectedScrubRef.current];
      if (results.poseLandmarks && scrubImg) {
        try {
          const left = results.poseLandmarks[11];
          const right = results.poseLandmarks[12];
          const shoulderWidth = Math.abs(right.x - left.x) * canvas.width;
          const width = shoulderWidth * 2.0;
          const height = scrubImg.height * (width / scrubImg.width);
          const centerX = ((left.x + right.x) / 2) * canvas.width;
          const shoulderY = (left.y + right.y) / 2;
          const topY = shoulderY * canvas.height - height * 0.3;
          ctx.drawImage(scrubImg, centerX - width / 2, topY, width, height);

          if (!window.skinToneDetectedOnce) {
            window.skinToneDetectedOnce = true;
            sendScreenshotToBackendForToneDetection();
          }
        } catch (err) {
          console.error("Upload overlay error:", err);
          notifyBackendError("Upload Overlay Drawing Error", err.message);
        }
      }
    });

    await pose.send({ image: img });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        if (selectedScrub) drawOnUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshot = async () => {
    const canvas = mode === "webcam" ? canvasRef.current : uploadCanvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${selectedScrub}_tryon.png`;
    link.click();
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText || rating === 0) {
      toast.error("Please provide a rating and feedback.");
      return;
    }

    try {
      await axios.post("http://localhost:5050/submit-feedback", {
        name: "User",
        email,
        feedback: feedbackText,
        rating,
      });
      toast.success("Feedback submitted!");
      setFeedbackText("");
      setRating(0);
    } catch (err) {
      toast.error("Failed to send feedback");
    }
  };

  const handleTimedScreenshot = () => {
    let timeLeft = 5;
    setCountdown(timeLeft);
    toast("📸 Get ready! Capturing in 5 seconds...");

    const interval = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft > 0) {
        setCountdown(timeLeft);
      } else {
        clearInterval(interval);
        setCountdown(null);
        handleScreenshot();
      }
    }, 1000);
  };

  const handleShare = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return toast.error("Please enter your email before sharing.");
    if (!emailPattern.test(email)) return toast.error("Please enter a valid email address.");

    const canvas = mode === "webcam" ? canvasRef.current : uploadCanvasRef.current;
    const imageData = canvas.toDataURL("image/png");
    const blob = await (await fetch(imageData)).blob();
    const formData = new FormData();
    formData.append("screenshot", blob, `${selectedScrub}_tryon.png`);
    formData.append("email", email);

    try {
      const response = await axios.post("http://localhost:5050/share-result", formData);
      setShareUrl(response.data.share_url);
      toast.success("Image shared successfully!");
    } catch (err) {
      toast.error("Sharing failed");
      console.error(err);
    }
    
  };

  return (
    <div className="tryon-container" ref={containerRef}>
      <h1>👕 Try It On</h1>
      <div className="mode-toggle">
        <button onClick={() => setMode("webcam")} className={mode === "webcam" ? "active" : ""}>
          <FaCamera style={{ marginRight: "5px" }} /> Webcam
        </button>
        <button onClick={() => setMode("upload")} className={mode === "upload" ? "active" : ""}>
          <FaImage style={{ marginRight: "5px" }} /> Upload
        </button>
      </div>
      <div className="button-group">
        {scrubOptions.map((scrub) => (
          <button
            key={scrub}
            className={`capture-button ${selectedScrub === scrub ? "active" : ""}`}
            onClick={() => setSelectedScrub(scrub)}
          >
            {scrub.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>
      <div className="video-wrapper">
        {mode === "webcam" && (
          <>
            <video ref={(el) => el && (webcamRef.current.video = el)} autoPlay muted playsInline className="webcam-feed" />
            <canvas ref={canvasRef} className="webcam-feed" />
            {countdown !== null && <div className="countdown-overlay">{countdown}</div>}
          </>
        )}
        {mode === "upload" && (
          <div className="upload-preview">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {!uploadedImage ? <p>Please select an image</p> : <canvas ref={uploadCanvasRef} className="uploaded-img" />}
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-col items-center">
        <input
          type="email"
          placeholder="Enter your email to share"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded border border-gray-400 mb-2 text-black"
        />
        <button onClick={handleScreenshot} className="capture-button">
          <FaCamera style={{ marginRight: "6px" }} /> Download Screenshot
        </button>
        <button onClick={handleTimedScreenshot} className="capture-button mt-2">
          <FaRegClock style={{ marginRight: "6px" }} /> Auto Capture in 5 sec
        </button>
        <button onClick={handleShare} className="capture-button mt-2">
          <FaEnvelope style={{ marginRight: "6px" }} /> Share via Email
        </button>
        {shareUrl && (
          <a href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp style={{ marginRight: "6px" }} /> Share on WhatsApp
          </a>
        )}
      </div>
      <div className="mt-10 p-4 border border-gray-600 rounded bg-[#1a1a1a] w-full max-w-xl mx-auto">
        <h3 className="text-lg font-semibold text-white mb-2">💬 Give Feedback</h3>
        <textarea
          className="w-full p-2 rounded border mb-3 text-black"
          rows="3"
          placeholder="Tell us what you think..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        />
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setRating(num)}
                className={num <= rating ? "text-yellow-400" : "text-gray-400"}
              >
                <FaStar />
              </button>
            ))}
          </div>
          <button onClick={handleSubmitFeedback} className="capture-button">
            Submit Feedback
          </button>
        </div>
      </div>
      <p className="mt-4 text-white">
        {mode === "webcam"
          ? "Move around — the scrub aligns with your real-time pose!"
          : "Upload an image and preview scrub overlays with pose detection!"}
      </p>
    </div>
  );
};

export default TryItOn;
