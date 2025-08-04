import React, { useState, type ChangeEvent } from 'react';

interface SlugProps {
  value: string;
  onChange: (slug: string) => void;
}

const Slug: React.FC<SlugProps> = ({ value, onChange }) => {
  const [input, setInput] = useState(value);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = raw
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')      // remove special chars
      .trim()
      .replace(/\s+/g, '-')          // replace spaces with hyphens
      .replace(/-+/g, '-');          // collapse multiple hyphens

    setInput(raw);
    onChange(formatted);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">Slug</label>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter a title or slug..."
        className="w-full px-3 py-2 rounded-md border border-zinc-700 bg-zinc-900 text-white placeholder-gray-400 outline-none"
      />
      {value && (
        <p className="text-sm text-gray-400">
          Final slug: <span className="text-green-400 font-mono">/{value}</span>
        </p>
      )}
    </div>
  );
};

export default Slug;
