import { useState, type ChangeEvent } from "react";

interface TitleProps {
  onChange: (value: string) => void;
}

function Title({ onChange }: TitleProps) {
  const [title, setTitle] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-white mb-2">Title</label>
      <input
        type="text"
        value={title}
        onChange={handleChange}
        placeholder="Your blog title goes here..."
        className="w-full px-4 py-3 text-2xl text-white bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-zinc-500 font-semibold"
      />
    </div>
  );
}

export default Title;
