import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export default function WebcamCapture() {
  const webcamRef = useRef(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [cleanedImage, setCleanedImage] = useState(null);

  const startWebcam = () => {
    setShowWebcam(true);
    setImagePreview(null);
    setCleanedImage(null);
  };

  const captureAndUpload = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    setImagePreview(imageSrc);

    const blob = await (await fetch(imageSrc)).blob();
    const formData = new FormData();
    formData.append("file", new File([blob], "capture.jpg", { type: "image/jpeg" }));

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setShowWebcam(false);
      toast.success("Uploaded successfully ✅");

      if (data.image_url) {
        setCleanedImage(`http://127.0.0.1:5000${data.image_url}`);
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast.error(error.message || "Something went wrong during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-center text-white bg-gray-900 rounded shadow">
      {!showWebcam && (
        <button
          onClick={startWebcam}
          className="px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
        >
          Start Camera
        </button>
      )}

      {showWebcam && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded shadow my-4 mx-auto"
          />
          <br />
          <button
            onClick={captureAndUpload}
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Capture & Upload
          </button>
        </>
      )}

      {loading && <p className="mt-4">🔄 Processing...</p>}

      {cleanedImage ? (
        <div className="my-4">
          <p><strong>📸 Processed Image:</strong></p>
          <img
            src={cleanedImage}
            alt="Processed"
            width="300"
            className="mx-auto rounded shadow hover:scale-105 transition-transform"
          />
        </div>
      ) : imagePreview && (
        <div className="my-4">
          <p><strong>📸 Captured Image:</strong></p>
          <img
            src={imagePreview}
            alt="Captured"
            width="300"
            className="mx-auto rounded shadow hover:scale-105 transition-transform"
          />
        </div>
      )}
    </div>
  );
}
