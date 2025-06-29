import React, { useState } from "react";

import { MediaUploadButton } from "./MediaUploadButton";
import SectionEditor from "./PostSectionEditor";

// Import any other components used in your Post editor (e.g., TagSelector, CategorySelector, SeoFields, etc.)

interface ContentPageFormData {
   title: string;
   slug: string;
   description: string;
   status: "draft" | "published";
   featured_image: string;
   categories: string[]; // If you use categories
   tags: string[]; // If you use tags
   seo_title: string;
   seo_description: string;
   sections: any[];
   // Add more fields as needed
}

const ContentPageEditor: React.FC<{
   initialData?: Partial<ContentPageFormData>;
   onSubmit: (data: ContentPageFormData) => void;
}> = ({ initialData = {}, onSubmit }) => {
   const [formData, setFormData] = useState<ContentPageFormData>({
      title: initialData.title || "",
      slug: initialData.slug || "",
      description: initialData.description || "",
      status: initialData.status || "draft",
      featured_image: initialData.featured_image || "",
      categories: initialData.categories || [],
      tags: initialData.tags || [],
      seo_title: initialData.seo_title || "",
      seo_description: initialData.seo_description || "",
      sections: initialData.sections || [],
      // Add more fields as needed
   });

   const handleChange = (field: keyof ContentPageFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
         {/* Title */}
         <div>
            <label className="block font-medium mb-1">Title</label>
            <input
               type="text"
               value={formData.title}
               onChange={(e) => handleChange("title", e.target.value)}
               className="w-full border rounded px-3 py-2"
               required
            />
         </div>
         {/* Slug */}
         <div>
            <label className="block font-medium mb-1">Slug</label>
            <input
               type="text"
               value={formData.slug}
               onChange={(e) => handleChange("slug", e.target.value)}
               className="w-full border rounded px-3 py-2"
            />
         </div>
         {/* Description */}
         <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
               value={formData.description}
               onChange={(e) => handleChange("description", e.target.value)}
               className="w-full border rounded px-3 py-2"
            />
         </div>
         {/* Status */}
         <div>
            <label className="block font-medium mb-1">Status</label>
            <select
               value={formData.status}
               onChange={(e) => handleChange("status", e.target.value)}
               className="w-full border rounded px-3 py-2"
            >
               <option value="draft">Draft</option>
               <option value="published">Published</option>
            </select>
         </div>
         {/* Featured Image */}
         <div>
            <label className="block font-medium mb-1">Featured Image</label>
            <MediaUploadButton
               value={formData.featured_image}
               onChange={(url) => handleChange("featured_image", url)}
            />
            {formData.featured_image && (
               <img src={formData.featured_image} alt="Featured" className="mt-2 max-w-xs rounded" />
            )}
         </div>
         {/* Categories (if used) */}
         {/* 
      <div>
        <label className="block font-medium mb-1">Categories</label>
        <CategorySelector
          value={formData.categories}
          onChange={(categories) => handleChange("categories", categories)}
        />
      </div>
      */}
         {/* Tags (if used) */}
         {/* 
      <div>
        <label className="block font-medium mb-1">Tags</label>
        <TagSelector
          value={formData.tags}
          onChange={(tags) => handleChange("tags", tags)}
        />
      </div>
      */}
         {/* SEO Fields (if used) */}
         <div>
            <label className="block font-medium mb-1">SEO Title</label>
            <input
               type="text"
               value={formData.seo_title}
               onChange={(e) => handleChange("seo_title", e.target.value)}
               className="w-full border rounded px-3 py-2"
            />
         </div>
         <div>
            <label className="block font-medium mb-1">SEO Description</label>
            <textarea
               value={formData.seo_description}
               onChange={(e) => handleChange("seo_description", e.target.value)}
               className="w-full border rounded px-3 py-2"
            />
         </div>
         {/* Sections */}
         <div>
            <label className="block font-medium mb-1">Sections</label>
            <SectionEditor sections={formData.sections} onChange={(sections) => handleChange("sections", sections)} />
         </div>
         {/* Add more fields as needed */}
         <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save Page
         </button>
      </form>
   );
};

export default ContentPageEditor;
