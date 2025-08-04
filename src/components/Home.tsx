import { useState } from 'react'
import Banner from './Banner'
import Tags from './Tags'
import Content from './Content'
import Title from './Title'
import Slug from './Slug'

function Home() {
  const handleTitleChange = (value: string) => {
    console.log("Title changed:", value);
  };

  const [tags, setTags] = useState<string[]>([]);
  const [slug, setSlug] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  return (
      <div>
        <Title onChange={handleTitleChange} />
        <Content />
        <Tags  value={tags} onChange={setTags} />
        <Slug value={slug} onChange={setSlug} />
        <Banner value={bannerUrl} onChange={setBannerUrl} />
    </div>
  )
}

export default Home
