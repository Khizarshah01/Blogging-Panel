import React, { useState, useRef, type ChangeEvent } from 'react';
import { Bold, Italic, Heading3, Code2, Eye, Edit3, List, ListOrdered, Quote, Link } from 'lucide-react';
import ImageUploader from './ImageUploader';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

interface BlogContentProps {
  value: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

const BlogEditor: React.FC<BlogContentProps> = ({ value, onChange, disabled }) => {
  const [content, setContent] = useState<string>(value);
  const [preview, setPreview] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onChange(e.target.value);
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
    onChange(updatedContent);

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
    { label: 'Bold', icon: Bold, action: () => insertAtCursor('**bold text**', 2) },
    { label: 'Italic', icon: Italic, action: () => insertAtCursor('_italic text_', 1) },
    { label: 'Heading', icon: Heading3, action: () => insertAtCursor('### Heading', 0) },
    { label: 'Code Block', icon: Code2, action: () => insertAtCursor('```js\n// your code here\n```', 15) },
    { label: 'Bullet List', icon: List, action: () => insertAtCursor('- List item\n- Another item', 0) },
    { label: 'Numbered List', icon: ListOrdered, action: () => insertAtCursor('1. First item\n2. Second item', 0) },
    { label: 'Quote', icon: Quote, action: () => insertAtCursor('> Block quote', 0) },
    { label: 'Link', icon: Link, action: () => insertAtCursor('[link text](https://)', 1) },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Markdown Editor</h2>
        <button
          onClick={() => setPreview(!preview)}
          className="flex items-center gap-2 text-sm px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition-colors"
        >
          {preview ? (
            <>
              <Edit3 size={16} /> Edit
            </>
          ) : (
            <>
              <Eye size={16} /> Preview
            </>
          )}
        </button>
      </div>

      {!preview ? (
        <>
          <div className="flex flex-wrap gap-2 mb-4 p-2 bg-zinc-900 rounded-lg">
            {toolbarButtons.map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-1 text-sm px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition-colors"
                title={label}
              >
                <Icon size={14} />
                <span className="sr-only md:not-sr-only">{label}</span>
              </button>
            ))}
            <ImageUploader onUpload={handleImageUpload} />
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            disabled={disabled}
            className="w-full min-h-[500px] p-4 bg-zinc-950 text-white border border-zinc-800 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            placeholder="Write your markdown here..."
          />
        </>
      ) : (
        <div className="prose prose-invert max-w-none bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-white">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl font-bold mb-6 text-white border-b border-zinc-700 pb-2" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl font-semibold mb-4 text-white mt-8 border-b border-zinc-700 pb-2" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-2xl font-semibold mb-3 text-white mt-6" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-gray-300 mb-4 leading-relaxed" {...props} />
              ),
              img: ({ node, ...props }) => (
                <div className="flex flex-col items-center my-6">
                  <img
                    {...props}
                    alt={props.alt ?? ''}
                    className="w-full max-w-2xl rounded-xl border border-gray-300 shadow-lg shadow-gray-300/20 transition-transform duration-300 hover:scale-[1.02]"
                  />
                  {props.alt && (
                    <p className="text-sm text-gray-400 mt-2 text-center">{props.alt}</p>
                  )}
                </div>
              ),
              a: ({ node, ...props }) => (
                <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-blue-500 pl-4 my-4 text-gray-300 italic bg-zinc-900 p-3 rounded-r"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />
              ),
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return inline ? (
                  <code
                    className="bg-zinc-800 text-purple-400 px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <div className="relative my-4">
                    <pre className="bg-zinc-900 text-gray-200 p-4 rounded-xl overflow-x-auto border border-zinc-700">
                      <code className={`font-mono text-sm ${className || ''}`} {...props}>
                        {children}
                      </code>
                    </pre>
                    {match && (
                      <span className="absolute top-0 right-0 bg-blue-600 text-xs text-white px-2 py-1 rounded-bl-md rounded-tr-md">
                        {match[1]}
                      </span>
                    )}
                  </div>
                );
              },
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full border-collapse" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th className="border border-zinc-700 px-4 py-2 text-left bg-zinc-800" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="border border-zinc-700 px-4 py-2" {...props} />
              ),
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