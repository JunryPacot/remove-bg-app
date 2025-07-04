import React, { useState, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function App() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const removeBackground = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image_file", image);
    formData.append("size", "auto");

    setLoading(true);

    const response = await fetch("/api/remove", {
  method: "POST",
  body: formData,
});

    setLoading(false);

    if (response.ok) {
      const blob = await response.blob();
      const resultUrl = URL.createObjectURL(blob);
      setResult(resultUrl);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    } else {
      alert("❌ Failed to remove background. Try again later. or message Junry Pacot");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-4 text-white flex flex-col items-center">
      <div className="bg-white text-gray-900 rounded-3xl shadow-2xl p-6 w-full max-w-xl animate-fade-in">
        <h1 className="text-3xl font-extrabold mb-6 text-center"> Image Background Remove by: Junry Pacot </h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
        />

        {preview && (
          <div className="mb-4">
            <p className="font-medium mb-2">Original Image:</p>
            <img src={preview} alt="Preview" className="rounded-xl shadow-md max-h-64 mx-auto" />
          </div>
        )}

        <button
          onClick={removeBackground}
          disabled={!image || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition flex justify-center items-center"
        >
          {loading ? <><Loader2 className="animate-spin w-5 h-5 mr-2" /> Removing...</> : "Remove Background"}
        </button>

        {result && (
          <div className="mt-8 text-center" ref={resultRef}>
            <h2 className="text-xl font-semibold mb-3">✅ Background Removed:</h2>
            <img src={result} alt="Result" className="mx-auto rounded-xl shadow-lg max-h-64" />
            <a
              href={result}
              download="no-bg.png"
              className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition"
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
