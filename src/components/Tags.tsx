import React, { useState, type KeyboardEvent, type ChangeEvent } from 'react';

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

const Tags: React.FC<TagsInputProps> = ({ value, onChange }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const trimmed = input.trim();

    if ((e.key === 'Enter' || e.key === ',') && trimmed) {
      e.preventDefault();
      if (!value.includes(trimmed)) {
        onChange([...value, trimmed]);
      }
      setInput('');
    }

    if (e.key === 'Backspace' && !input && value.length > 0) {
      const newTags = [...value];
      newTags.pop();
      onChange(newTags);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div>
      Tags
      <div className="flex flex-wrap gap-2 p-2 bg-zinc-900 border border-zinc-700 rounded-md">
        {value.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-zinc-800 text-white border border-zinc-600"
          >
            #{tag}
            <button onClick={() => handleRemoveTag(tag)} className="text-red-400 hover:text-red-500">
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none text-white placeholder-gray-400"
          placeholder="Add a tag and press Enter"
        />
      </div>
    </div>
  );
};

export default Tags;
