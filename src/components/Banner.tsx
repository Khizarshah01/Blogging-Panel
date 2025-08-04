import React from 'react';
import ImageUploader from './ImageUploader';

interface BannerProps {
  value: string;
  onChange: (url: string) => void;
}

const Banner: React.FC<BannerProps> = ({ value, onChange }) => {
  const handleUpload = (url: string) => {
    onChange(url);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-white">Banner Image</label>

      <ImageUploader onUpload={handleUpload} />

      {value && (
        <img
          src={value}
          alt="Banner Preview"
          className="w-[500px] max-w-full rounded-xl border border-gray-300 shadow-lg shadow-gray-300/40 transition-transform duration-300 hover:scale-[1.03]"
        />
      )}
    </div>
  );
};

export default Banner;
