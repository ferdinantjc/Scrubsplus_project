import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import Button from '../components/Button';

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:4000/api/csv/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setMsg(data.message || 'Upload complete!');
    } catch (err) {
      console.error(err);
      setMsg('Upload failed.');
    }
  };

  return (
    <AdminLayout title="Upload Products via CSV">
      <form onSubmit={handleUpload} className="flex flex-col gap-4 max-w-lg">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="border border-gray-300 p-2 rounded"
        />

        <div className="flex gap-4">
          <Button type="submit">Upload CSV</Button>

          <a
            href="http://localhost:4000/api/csv/export"
            className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition duration-200"
            download
          >
            Download CSV
          </a>
        </div>
      </form>

      {msg && (
        <p
          className={`mt-4 font-medium ${
            msg.toLowerCase().includes('fail') ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {msg}
        </p>
      )}
    </AdminLayout>
  );
};

export default UploadCSV;
