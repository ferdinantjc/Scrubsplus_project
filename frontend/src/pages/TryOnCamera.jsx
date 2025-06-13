import React, { useEffect, useRef, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

const scrubOptions = {
  dopamine_hit: 'https://res.cloudinary.com/du4zlbpzk/image/upload/v1749347374/dopamine_hit_gx0abr.png',
  espresso_yourself: 'https://res.cloudinary.com/du4zlbpzk/image/upload/v1749347414/espresso_yourself_xegzpm.png',
  just_bee_you: 'https://res.cloudinary.com/du4zlbpzk/image/upload/v1749347344/just_bee_you_pnzqb6.png',
};

const TryOnCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scrubImages = useRef({});
  const cameraRef = useRef(null);

  const [selectedScrub, setSelectedScrub] = useState('dopamine_hit');
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [countdown, setCountdown] = useState(0);

  // ✅ Preload scrub images with crossOrigin fix
  useEffect(() => {
    let loaded = 0;
    const keys = Object.keys(scrubOptions);
    keys.forEach((key) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // ⭐ CORS fix for Cloudinary screenshot
      img.src = scrubOptions[key];
      img.onload = () => {
        scrubImages.current[key] = img;
        loaded++;
        if (loaded === keys.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  // ✅ Setup Pose + drawing logic
  useEffect(() => {
    if (!imagesLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      canvas.width = results.image.width;
      canvas.height = results.image.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      const lm = results.poseLandmarks;
      if (!lm) return;

      const lShoulder = lm[11];
      const rShoulder = lm[12];

      if (lShoulder && rShoulder) {
        const x1 = lShoulder.x * canvas.width;
        const x2 = rShoulder.x * canvas.width;
        const y1 = lShoulder.y * canvas.height;

        const centerX = (x1 + x2) / 2;
        const width = Math.abs(x2 - x1) * 2.0;
        const overlay = scrubImages.current[selectedScrub];

        if (overlay) {
          const aspect = overlay.width / overlay.height;
          const height = width / aspect;

          ctx.drawImage(
            overlay,
            centerX - width / 2 + offsetX,
            y1 - height * 0.25,
            width,
            height
          );
        }
      }
    });

    cameraRef.current = new Camera(video, {
      onFrame: async () => {
        await pose.send({ image: video });
      },
      width: 640,
      height: 480,
    });

    cameraRef.current.start();

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
    };
  }, [imagesLoaded, selectedScrub, offsetX]);

  // ✅ Screenshot with CORS fix and delay
  const handleScreenshot = () => {
    let counter = 3;
    setCountdown(counter);

    const interval = setInterval(() => {
      counter--;
      if (counter > 0) {
        setCountdown(counter);
      } else {
        clearInterval(interval);
        setCountdown(0);

        setTimeout(() => {
          const canvas = canvasRef.current;
          if (!canvas) {
            alert('Canvas not found.');
            return;
          }

          try {
            const dataURL = canvas.toDataURL('image/png');
            if (!dataURL || dataURL === 'data:,') {
              alert('Screenshot failed. Canvas is empty.');
              return;
            }

            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `${selectedScrub}_tryon.png`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (err) {
            console.error('Screenshot error:', err);
            alert('Something went wrong while capturing.');
          }
        }, 500); // give time for last frame to draw
      }
    }, 1000);
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
      <h2>🧥 Try On a Scrub</h2>

      <div style={{ marginBottom: '1rem' }}>
        {Object.keys(scrubOptions).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedScrub(key)}
            style={{
              margin: '0 8px',
              padding: '8px 16px',
              backgroundColor: selectedScrub === key ? '#00b88c' : '#444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {key.replace(/_/g, ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* ➕ Horizontal Offset Slider */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ color: '#333', fontWeight: 600 }}>Adjust Horizontal Position:</label>
        <input
          type="range"
          min={-100}
          max={100}
          step={1}
          value={offsetX}
          onChange={(e) => setOffsetX(parseInt(e.target.value))}
          style={{ width: '300px', marginLeft: '10px' }}
        />
        <span style={{ marginLeft: '10px' }}>{offsetX}px</span>
      </div>

      {/* 📸 Screenshot button + countdown */}
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={handleScreenshot}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff6347',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          📸 Capture Screenshot
        </button>

        {countdown > 0 && (
          <p style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '10px', color: '#e60023' }}>
            {countdown}
          </p>
        )}
      </div>

      <div style={{ position: 'relative', width: 640, height: 480, margin: '1rem auto' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            width: '640px',
            height: '480px',
          }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2,
            border: '2px solid lime',
          }}
        />
      </div>
    </div>
  );
};

export default TryOnCamera;
