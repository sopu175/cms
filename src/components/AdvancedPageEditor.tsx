import React, { useState } from "react";

import { MediaUploadButton } from "./MediaUploadButton";
import SectionEditor from "./PostSectionEditor";

// Import your custom editors/selectors as used in AdvancedPostEditor
// import CategorySelector from "./CategorySelector";
// import TagSelector from "./TagSelector";
// import RichTextEditor from "./RichTextEditor";

const TABS = [
   { key: "content", label: "Content" },
   { key: "blocks", label: "Content Blocks" },
   { key: "sections", label: "Sections" },
   { key: "media", label: "Media" },
   { key: "seo", label: "SEO" },
   { key: "settings", label: "Settings" },
];

const AdvancedPageEditor = ({ page, onSave, onCancel }) => {
   const [activeTab, setActiveTab] = useState("content");
   const [formData, setFormData] = useState({
      title: page?.title || "",
      slug: page?.slug || "",
      excerpt: page?.excerpt || "",
      content: page?.content || "",
      status: page?.status || "draft",
      featured_image: page?.featured_image || "",
      categories: page?.categories || [],
      tags: page?.tags || [],
      seo_title: page?.seo_title || "",
      seo_description: page?.seo_description || "",
      sections: page?.sections || [],
      blocks: page?.blocks || [],
      // Add any other fields from AdvancedPostEditor
   });

   const handleChange = (field, value) => setFormData((f) => ({ ...f, [field]: value }));

   const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
   };

   return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-start justify-center overflow-auto">
         <div className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-4xl mt-10 mb-10">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
               <h2 className="text-2xl font-semibold">Create New Page</h2>
               <div>
                  <button onClick={onCancel} className="mr-4 text-gray-400 hover:text-white">
                     Cancel
                  </button>
                  <button
                     onClick={handleSubmit}
                     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                     Save Page
                  </button>
               </div>
            </div>
            {/* Tabs */}
            <div className="flex space-x-6 px-8 pt-4 border-b border-gray-800">
               {TABS.map((tab) => (
                  <button
                     key={tab.key}
                     className={`pb-2 text-lg font-medium ${
                        activeTab === tab.key ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400"
                     }`}
                     onClick={() => setActiveTab(tab.key)}
                  >
                     {tab.label}
                  </button>
               ))}
            </div>
            {/* Tab Content */}
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">
               {activeTab === "content" && (
                  <div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                           <label className="block mb-2 font-semibold">Title</label>
                           <input
                              type="text"
                              value={formData.title}
                              onChange={(e) => handleChange("title", e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                              required
                           />
                        </div>
                        <div>
                           <label className="block mb-2 font-semibold">Slug</label>
                           <input
                              type="text"
                              value={formData.slug}
                              onChange={(e) => handleChange("slug", e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                           />
                        </div>
                     </div>
                     <div className="mb-6">
                        <label className="block mb-2 font-semibold">Excerpt</label>
                        <textarea
                           value={formData.excerpt}
                           onChange={(e) => handleChange("excerpt", e.target.value)}
                           className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                        />
                     </div>
                     <div>
                        <label className="block mb-2 font-semibold">Content</label>
                        {/* Replace with your RichTextEditor if used */}
                        <textarea
                           value={formData.content}
                           onChange={(e) => handleChange("content", e.target.value)}
                           className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white min-h-[120px]"
                        />
                     </div>
                  </div>
               )}
               {activeTab === "blocks" && (
                  <div>
                     {/* Replace with your Content Blocks editor if used */}
                     <p className="text-gray-400">Content Blocks editor goes here.</p>
                  </div>
               )}
               {activeTab === "sections" && (
                  <SectionEditor
                     sections={formData.sections}
                     onChange={(sections) => handleChange("sections", sections)}
                  />
               )}
               {activeTab === "media" && (
                  <div>
                     <label className="block mb-2 font-semibold">Featured Image</label>
                     <MediaUploadButton
                        value={formData.featured_image}
                        onChange={(url) => handleChange("featured_image", url)}
                     />
                     {formData.featured_image && (
                        <img src={formData.featured_image} alt="Featured" className="mt-4 max-w-xs rounded" />
                     )}
                  </div>
               )}
               {activeTab === "seo" && (
                  <div>
                     <label className="block mb-2 font-semibold">SEO Title</label>
                     <input
                        type="text"
                        value={formData.seo_title}
                        onChange={(e) => handleChange("seo_title", e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                     />
                     <label className="block mt-6 mb-2 font-semibold">SEO Description</label>
                     <textarea
                        value={formData.seo_description}
                        onChange={(e) => handleChange("seo_description", e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                     />
                  </div>
               )}
               {activeTab === "settings" && (
                  <div>
                     <label className="block mb-2 font-semibold">Status</label>
                     <select
                        value={formData.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                     >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                     </select>
                     {/* Add more settings fields as in AdvancedPostEditor */}
                  </div>
               )}
            </form>
         </div>
      </div>
   );
};

export default AdvancedPageEditor;
