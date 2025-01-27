import React, { useState } from "react";
import { IoIosCloudUpload } from "react-icons/io";

function Main() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setError("");
    } else {
      setError("Please select a valid image file");
      setSelectedFile(null);
    }
  };

  const convertImage = async () => {
    if (!selectedFile || !selectedFormat) {
      setError("Please select both a file and conversion format");
      return;
    }

    try {
      // Create image element
      const image = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        image.src = reader.result;
        image.onload = () => {
          // Create canvas
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0);

          // Convert and download
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `img.${selectedFormat}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, `image/${selectedFormat}`);
        };
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError("Error converting image");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex justify-center items-center">
        <div className="flex flex-col space-y-4 w-full max-w-md px-4">
          <div className="p-4">
            <h1 className="text-4xl font-bold text-white">Image Type Converter</h1>
          </div>
          <label className="flex flex-col items-center px-4 py-6 bg-neutral-800 text-white rounded-lg cursor-pointer hover:bg-neutral-700 focus:outline-none border border-neutral-700 focus:border-yellow-500">
            <IoIosCloudUpload />
            <span className="mt-2 text-base">
              {selectedFile ? selectedFile.name : "Click to upload file"}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <select
            className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-yellow-500"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="">Select conversion type</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
            <option value="jpeg">JPEG</option>
          </select>
          <button
            className="w-full p-3 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={convertImage}
            disabled={!selectedFile || !selectedFormat}
          >
            Convert & Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default Main;
