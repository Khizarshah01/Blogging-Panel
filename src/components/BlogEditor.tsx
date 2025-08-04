import React, { useState, useRef, type ChangeEvent } from 'react';
import { Bold, Italic, Heading3, Code2, Eye, Edit3 } from 'lucide-react';
import ImageUploader from './ImageUploader';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogEditor: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [preview, setPreview] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const insertAtCursor = (text: string, cursorOffset = 0) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);

    const updatedContent = `${before}${text}${after}`;
    setContent(updatedContent);

    setTimeout(() => {
      const pos = start + text.length - cursorOffset;
      textarea.selectionStart = textarea.selectionEnd = pos;
      textarea.focus();
    }, 0);
  };

  const handleImageUpload = (url: string) => {
    insertAtCursor(`\n![](${url})\n`);
  };

  const toolbarButtons = [
    { label: 'Bold', icon: Bold, action: () => insertAtCursor('**bold**', 4) },
    { label: 'Italic', icon: Italic, action: () => insertAtCursor('_italic_', 1) },
    { label: 'Heading', icon: Heading3, action: () => insertAtCursor('### Heading\n') },
    { label: 'Code', icon: Code2, action: () => insertAtCursor('```js\ncode here\n```', 11) },
  ];

  return (
    <div>
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={() => setPreview(!preview)}
          className="flex items-center gap-2 text-sm px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md"
        >
          {preview ? <Edit3 size={16} /> : <Eye size={16} />}
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {!preview ? (
        <>
          <div className="flex gap-3 flex-wrap mb-4">
            {toolbarButtons.map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-2 text-sm px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md"
              >
                <Icon size={14} /> {label}
              </button>
            ))}
            <ImageUploader onUpload={handleImageUpload} />
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            className="w-full h-96 p-4 bg-zinc-950 text-white border border-zinc-800 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Write your markdown here..."
          />
        </>
      ) : (
        <div className="mt-6 bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-white">
        <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
      h1: ({ node, ...props }) => (
      <h1 className="text-4xl font-bold mb-4 text-white" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-3xl font-semibold mb-3 text-white" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-2xl font-semibold mb-2 text-white" {...props} />
    ),
    img: ({ node, ...props }) => (
      <div className="flex justify-center my-6">
        <img
          {...props}
          alt={props.alt ?? ''}
          className="w-[500px] max-w-full rounded-xl border border-gray-300 shadow-lg shadow-gray-300/40 transition-transform duration-300 hover:scale-[1.03]"
        />
      </div>
    ),
    code({ node, inline, className, children, ...props }: any) {
      return inline ? (
        <code
          className="bg-zinc-800 text-purple-400 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      ) : (
        <pre className="bg-zinc-900 text-gray-200 p-4 rounded-xl overflow-x-auto my-4 border border-zinc-700">
          <code className={`font-mono text-sm ${className || ''}`} {...props}>
            {children}
          </code>
        </pre>
      );
    },
  }}
>
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
