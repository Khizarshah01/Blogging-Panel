import { useState } from 'react';
import Banner from './Banner';
import Tags from './Tags';
import Title from './Title';
import Slug from './Slug';
import BlogEditor from './BlogEditor';
import axios from 'axios';

function Home() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [slug, setSlug] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!title || !slug || !content) {
      setMessage('Title, slug, and content are required.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/blogs`,
        {
          title,
          slug,
          content,
          tags,
          banner: bannerUrl,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${import.meta.env.VITE_API_KEY}`, 
          },
        }
      );

      setMessage('Blog posted successfully!');
      console.log(response.data);

      setTitle('');
      setSlug('');
      setTags([]);
      setBannerUrl('');
      setContent('');
    } catch (error: any) {
      console.error('Failed to post blog:', error);
      setMessage(error?.response?.data?.error || 'Failed to post blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Title onChange={setTitle} />
      <BlogEditor value={content} onChange={setContent} />
      <Tags value={tags} onChange={setTags} />
      <Slug value={slug} onChange={setSlug} />
      <Banner value={bannerUrl} onChange={setBannerUrl} />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Posting...' : 'Post Blog'}
      </button>

      {message && (
        <p className="mt-4 text-sm text-yellow-300">{message}</p>
      )}
    </div>
  );
}

export default Home;
