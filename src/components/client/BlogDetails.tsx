import React from 'react';
import Image from 'next/image';
import Img from '../ui/Img';
import NestedGallery from './NestedGallery';

interface Section {
  section_title: string;
  images?: { title: string; url: string }[];
  markup?: {
    text_list?: string[];
    images_list?: string[];
    table_list?: Record<string, string>[];
    ul_li_list?: string[];
  };
  links?: { label: string; url: string; target?: string; type?: string }[];
  date_time?: string;
  author?: string;
}

interface BlogDetailsProps {
  blog: {
    title: string;
    background_image: string;
    slug: string;
    html_markup?: string;
    timestamp?: string;
    background_color?: string;
    sections?: Section[];
  };
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ blog }) => {
console.log('gallery', blog)

  return (
      <section className={'blog-details pt-[120px] pb-[120px]'}>
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Banner with image, title, date, author */}
          <div className="aspect-w-16 aspect-h-9 w-full">
            <Image
                alt={blog.title}
                src={blog.background_image}
                width={900}
                height={475}
            />
          </div>
          <div className="px-4 py-6">
            <div className="mt-4 text-2xl font-bold">{blog.title}</div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
              {blog.sections && blog.sections[0]?.author && (
                  <span className="text-xs text-gray-500">By {blog.sections[0].author}</span>
              )}
              {blog.sections && blog.sections[0]?.date_time && (
                  <span className="text-xs text-gray-400">{new Date(blog.sections[0].date_time).toLocaleString()}</span>
              )}
            </div>
            <div className="text-sm text-gray-500 mb-2">/{blog.slug}</div>
            {/* Render all sections */}
            {blog.sections?.map((section, idx) => (
                <div key={idx}>
                  {/* 1. Overview section */}
                  <h2 className="text-xl font-semibold mb-2 mb-[60px]">Overview: {section.section_title}</h2>
                  {section.images && section.images.length > 0 && (
                      <>
                        <div className="font-semibold mb-1 mb-[20px]">Images</div>
                        <div className="flex gap-4 mb-4 flex-wrap mb-[60px]">
                          {section.images.map((img, i) => (
                              <div key={i} className="w-120 mb-[20px]">
                                <Img
                                    alt={img.title}
                                    srcLg={img.url}
                                    widthPx={320}
                                    heightPx={180}
                                    className="rounded"
                                />
                                <div className="text-xs text-center mt-1">{img.title}</div>
                              </div>
                          ))}
                        </div>
                      </>
                  )}
                  {/* 2. Text section */}
                  {section.markup?.text_list && (
                      <>
                        <div className="font-semibold mb-[20px]">Text</div>
                        <div className="mb-4 space-y-2 mb-[60px]">
                          {section.markup.text_list.map((text, i) => (
                              <p key={i} className="text-base text-white">{text}</p>
                          ))}
                        </div>
                      </>
                  )}
                  {/* 3. Image section */}

                  <NestedGallery data={blog}/>

                  {/* 4. Table section */}
                  {section.markup?.table_list && section.markup.table_list.length > 0 && (
                      <>
                        <div className="font-semibold mb-1 mb-[20px]">Table</div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border text-sm mb-[60px]">
                            <thead>
                            <tr>
                              {Object.keys(section.markup.table_list[0]).map((col) => (
                                  <th key={col}
                                      className="border px-2 py-1 bg-gray-100 capitalize text-[black] text-left mb-[60px]">{col}</th>
                              ))}
                            </tr>
                            </thead>
                            <tbody>
                            {section.markup.table_list.map((row, i) => (
                                <tr key={i}>
                                  {Object.values(row).map((val, j) => (
                                      <td key={j} className="border px-2 py-1 mb-[60px]">{val}</td>
                                  ))}
                                </tr>
                            ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                  )}
                  {/* 5. Listing section */}
                  {section.markup?.ul_li_list && section.markup.ul_li_list.length > 0 && (
                      <>
                        <div className="font-semibold mb-1 mb-[20px]">List</div>
                        <ul className="list-disc list-inside mb-4 mb-[60px]">
                          {section.markup.ul_li_list.map((li, i) => (
                              <li key={i} className="mb-[10px]">{li}</li>
                          ))}
                        </ul>
                      </>
                  )}
                  {/* 6. Button/links section */}
                  {section.links && section.links.length > 0 && (
                      <>
                        <div className="font-semibold mb-1 mb-[20px]">Links</div>
                        <div className="flex gap-3 flex-wrap mt-2">
                          {section.links.map((link, i) => (
                              <a
                                  key={i}
                                  href={link.url}
                                  target={link.target || '_self'}
                                  rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-[60px]"
                              >
                                {link.label}
                              </a>
                          ))}
                        </div>
                      </>
                  )}
                </div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default BlogDetails; 