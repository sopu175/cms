import BlogDetails from '@/components/client/BlogDetails';
import { notFound } from 'next/navigation';
import { getBlogData } from '@/utils/api';

interface BlogParams {
  params: { slug: string };
}

export default async function BlogDetailPage({ params }: BlogParams) {
  const resolvedParams = await params;

  // Fetch blog data for the specific slug
  const blogs = await getBlogData();
  const data = blogs ? blogs.find((blog: any) => blog.slug === resolvedParams.slug) : null;

  if (!data) {
    notFound(); // Handle error case
  }

  return <BlogDetails blog={data} />;
}