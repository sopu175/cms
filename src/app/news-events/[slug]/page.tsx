import BlogDetails from '@/components/client/BlogDetails';
import { notFound } from 'next/navigation';

interface BlogParams {
  params: { slug: string };
}

async function getBlogBySlug(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/json/blog/blog_list.json`, {
    cache: 'no-store',
  });
  const blogs = await res.json();
  return blogs.find((blog: any) => blog.slug === slug);
}

export default async function BlogDetailPage({ params }: BlogParams) {
  const resolvedParams = await params;

  // Fetch page data on the server side
  const data = await getBlogBySlug(resolvedParams.slug);

  console.log(data, 'data');

  if (!data) {
      notFound(); // Handle error case
  }

  console.log('Base URL:', data);
  return <BlogDetails blog={data} />;
} 