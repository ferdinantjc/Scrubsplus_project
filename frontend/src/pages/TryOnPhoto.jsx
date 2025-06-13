import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Cloudinary garment URLs
const garmentOptions = {
  dopamine_hit: "https://res.cloudinary.com/du4zlbpzk/image/upload/v1749347374/dopamine_hit_gx0abr.png",
  espresso_yourself: "https://res.cloudinary.com/du4zlbpzk/image/upload/v1749347414/espresso_yourself_xegzpm.png",
  just_bee_you: "https://res.cloudinary.com/du4zlbpzk/image/upload/v1749347344/just_bee_you_pnzqb6.png",
};

const TryOnPhoto = () => {
  const [modelFile, setModelFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [selectedGarment, setSelectedGarment] = useState('dopamine_hit');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleModelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setModelFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setResult('');
    }
  };

  const pollStatus = async (id, retries = 20, delay = 3000) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const res = await axios.get(`/api/fashn/status/${id}`);
        const { status, output } = res.data;

        if (status === 'completed' && output?.[0]) {
          setResult(output[0]);
          toast.success('✅ Try-on completed!');
          return;
        } else if (status === 'failed') {
          toast.error('❌ Try-on failed.');
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (err) {
        console.error('Polling error:', err);
        toast.error('❌ Error while checking try-on status.');
        return;
      }
    }
    toast.error('⏱️ Try-on timed out.');
  };

  const handleTryOn = async () => {
    if (!modelFile) {
      toast.error('📸 Please upload a model image.');
      return;
    }

    const formData = new FormData();
    formData.append('model', modelFile);
    formData.append('garment_image_url', garmentOptions[selectedGarment]);
    formData.append('category', 'tops');
    formData.append('mode', 'performance');

    try {
      setLoading(true);
      toast.info('⏳ Uploading and initiating try-on...');

      const res = await axios.post('/api/fashn/tryon', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.id) {
        toast.info('🧠 AI is processing... Hang tight!');
        await pollStatus(res.data.id);
      } else {
        toast.error('❌ Failed to initiate try-on.');
      }
    } catch (err) {
      console.error('Try-on error:', err);
      toast.error('❌ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">👗 Virtual Try-On Tool</h2>

      <input type="file" accept="image/*" onChange={handleModelUpload} className="mb-4" />

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
        {previewURL && (
          <div className="text-center">
            <p className="mb-2 text-sm font-semibold text-gray-600">👤 Model Image</p>
            <img src={previewURL} alt="Model Preview" className="max-w-[200px] rounded shadow" />
          </div>
        )}
        {selectedGarment && (
          <div className="text-center">
            <p className="mb-2 text-sm font-semibold text-gray-600">🧥 Garment Image</p>
            <img src={garmentOptions[selectedGarment]} alt="Garment Preview" className="max-w-[200px] rounded shadow" />
          </div>
        )}
        {result && (
          <div className="text-center">
            <p className="mb-2 text-sm font-semibold text-gray-600">🧩 Try-On Result</p>
            <img src={result} alt="Try-On Output" className="max-w-[200px] rounded shadow" />
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3 flex-wrap mb-6">
        {Object.entries(garmentOptions).map(([key]) => (
          <button
            key={key}
            onClick={() => setSelectedGarment(key)}
            disabled={loading}
            className={`px-4 py-2 rounded border text-sm transition ${
              selectedGarment === key
                ? 'bg-black text-white border-black'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {key.replaceAll('_', ' ')}
          </button>
        ))}
      </div>

      <button
        onClick={handleTryOn}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded disabled:opacity-60"
      >
        {loading ? 'Processing...' : 'Try It On'}
      </button>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
};

export default TryOnPhoto;
