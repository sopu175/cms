import { NextRequest, NextResponse } from 'next/server';

interface Section {
  title: string;
  content: string;
}

interface Content {
  title: string;
  subtitle: string;
  sections: Section[];
}

interface PageData {
  images: string[];
  content: Content;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest): Promise<NextResponse<PageData>> {
  // Simulate loading time
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Example page data
  const data: PageData = {
    images: [
      'https://source.unsplash.com/random/800x600',
      'https://source.unsplash.com/random/800x601',
      'https://source.unsplash.com/random/800x602',
    ],
    content: {
      title: 'Next.js + GSAP Performance',
      subtitle: 'A powerful combination of modern web technologies',
      sections: [
        {
          title: 'Performance Optimized',
          content: 'Built with performance in mind from the ground up.',
        },
        {
          title: 'Beautiful Animations',
          content: 'Smooth, performant animations powered by GSAP.',
        },
        {
          title: 'Modern Development',
          content: 'Using the latest web technologies and best practices.',
        },
      ],
    },
  };

  return NextResponse.json(data);
}
