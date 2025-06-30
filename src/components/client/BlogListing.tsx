'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardTitle } from '../ui/card';
import Img from '../ui/Img';
import { getBlogData } from '@/utils/api';

// Type for a single blog item
interface BlogItem {
  title: string;
  background_image: string;
  slug: string;
  timestamp?: string;
}

// Props for BlogListing
interface BlogListingProps {
  data?: {
    blogs_list?: BlogItem[];
    gallery?: BlogItem[];
  };
}

const BlogListing: React.FC<BlogListingProps> = ({ data }) => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If blogs are provided in props, use them
    if (data?.blogs_list && data.blogs_list.length > 0) {
      setBlogs(data.blogs_list);
      return;
    }

    // Otherwise fetch blogs from API
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const fetchedBlogs = await getBlogData();
        if (fetchedBlogs && Array.isArray(fetchedBlogs)) {
          setBlogs(fetchedBlogs);
        } else {
          setError('No blog posts found');
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [data]);

  if (isLoading) {
    return (
      <section className="blog-list">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="blog-list">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center p-8 bg-red-50 rounded-lg my-8">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <section className="blog-list">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center p-8 bg-gray-50 rounded-lg my-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Blog Posts</h2>
            <p className="text-gray-600">There are currently no blog posts available.</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="blog-list">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-[0] py-[100px]">
          {blogs.map((blog) => (
            <Link key={blog.slug} href={`/news-events/${blog.slug}`} className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-w-16 aspect-h-9 w-full">
                  <Img
                    alt={blog.title}
                    srcLg={blog.background_image}
                    widthPx={800}
                    heightPx={450}
                    className="rounded-t-lg"
                  />
                </div>
                <CardContent>
                  <CardTitle className="mt-2 text-lg font-bold">{blog.title}</CardTitle>
                  {blog.timestamp && (
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(blog.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogListing;