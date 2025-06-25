'use client'

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardTitle } from '../ui/card';
import Img from '../ui/Img';

// Type for a single blog item
interface BlogItem {
  title: string;
  background_image: string;
  slug: string;
}

// Props for BlogListing
interface BlogListingProps {
  data?: {
      gallery?: BlogItem[];
  };
}

const BlogListing: React.FC<BlogListingProps> = ({ data }) => {
  
  return (
      <section className={'blog-list'}>
        <div className={'container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-[0] py-[100px]">
            {data?.blogs_list?.map((blog) => (
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
