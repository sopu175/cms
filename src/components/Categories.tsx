import { Edit, FolderOpen, Plus, Save, Search, Trash2, X } from "lucide-react";
import React, { useState } from "react";

import { Category, PostSection } from "../types";
import MediaUploadButton from './MediaUploadButton';
import SectionEditor from "./PostSectionEditor";
import { useAuth } from "../contexts/AuthContext";
import { useCategories } from "../hooks/useCategories";

const Categories: React.FC = () => {
   const { user } = useAuth();
   const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories();
   const [searchTerm, setSearchTerm] = useState("");
   const [showModal, setShowModal] = useState(false);
   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
   const [formData, setFormData] = useState<{
      name: string;
      description: string;
      color: string;
      parent_id: string;
      featured_image: string;
      sections: PostSection[];
      category_type: 'post' | 'product';
   }>({
      name: "",
      description: "",
      color: "#3B82F6",
      parent_id: "",
      featured_image: "",
      sections: [],
      category_type: "post"
   });

   const canEdit = ["admin", "editor"].includes(user?.role || "");

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const categoryData = {
         ...formData,
         category_type: formData.category_type as 'post' | 'product' | undefined,
         sections: (formData.sections || []) as PostSection[],
         slug: formData.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
      };

      let result;
      if (editingCategory) {
         result = await updateCategory(editingCategory.id, categoryData);
      } else {
         result = await createCategory(categoryData);
      }

      if (result.success) {
         setShowModal(false);
         setEditingCategory(null);
         setFormData({ 
            name: "", 
            description: "", 
            color: "#3B82F6", 
            parent_id: "", 
            featured_image: "", 
            sections: [] as PostSection[],
            category_type: "post" as 'post' | 'product'
         });
      } else {
         console.log('Category creation error:', result);
         alert(result.error ? result.error : JSON.stringify(result));
      }
   };

   const handleEdit = (category: Category) => {
      setEditingCategory(category);
      setFormData({
         name: category.name,
         description: category.description || "",
         color: category.color,
         parent_id: category.parent_id || "",
         featured_image: category.featured_image || "",
         sections: (category.sections || []) as PostSection[],
         category_type: category.category_type === 'post' || category.category_type === 'product' ? category.category_type : 'post',
      });
      setShowModal(true);
   };

   const handleDelete = async (categoryId: string) => {
      if (!confirm("Are you sure you want to delete this category?")) return;

      const result = await deleteCategory(categoryId);
      if (!result.success) {
         alert(result.error || "Failed to delete category");
      }
   };

   // Filter categories by type for parent selection
   const getParentCategoriesOptions = () => {
      return categories.filter(cat => 
         cat.category_type === formData.category_type && 
         (!editingCategory || cat.id !== editingCategory.id)
      );
   };

   // Filter categories for display
   const filteredCategories = categories.filter(
      (category) =>
         category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         category.description?.toLowerCase().includes(searchTerm.toLowerCase())
   );

   if (loading) {
      return (
         <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
               <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Categories</h2>
               <p className="text-gray-600 dark:text-gray-400">Organize your content</p>
            </div>
            {canEdit && (
               <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
               >
                  <Plus className="w-4 h-4" />
                  <span>New Category</span>
               </button>
            )}
         </div>

         {/* Search */}
         <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
               type="text"
               placeholder="Search categories..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
         </div>

         {/* Categories Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
               <div
                  key={category.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg transition-shadow"
               >
                  <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center space-x-3">
                        <div
                           className="w-12 h-12 rounded-xl flex items-center justify-center"
                           style={{ backgroundColor: `${category.color}20` }}
                        >
                           <FolderOpen className="w-6 h-6" style={{ color: category.color }} />
                        </div>
                        <div>
                           <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                           <div className="flex items-center space-x-2">
                              <p className="text-sm text-gray-500 dark:text-gray-400">{category.post_count || 0} items</p>
                              {category.category_type && (
                                 <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                    {category.category_type === 'post' ? 'Post' : 'Product'}
                                 </span>
                              )}
                           </div>
                        </div>
                     </div>
                     {canEdit && (
                        <div className="flex items-center space-x-2">
                           <button
                              onClick={() => handleEdit(category)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                           >
                              <Edit className="w-4 h-4" />
                           </button>
                           <button
                              onClick={() => handleDelete(category.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     )}
                  </div>
                  {category.description && (
                     <p className="text-gray-600 dark:text-gray-400 text-sm">{category.description}</p>
                  )}
                  {category.parent_id && (
                     <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        Parent: {categories.find(c => c.id === category.parent_id)?.name || 'Unknown'}
                     </div>
                  )}
               </div>
            ))}
         </div>

         {filteredCategories.length === 0 && (
            <div className="text-center py-12">
               <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-8 h-8 text-gray-500" />
               </div>
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories found</h3>
               <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? "Try adjusting your search terms" : "Create your first category to get started"}
               </p>
            </div>
         )}

         {/* Modal */}
         {showModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
               <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                  <div
                     className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                     onClick={() => setShowModal(false)}
                  />

                  <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                           {editingCategory ? "Edit Category" : "New Category"}
                        </h3>
                        <button
                           onClick={() => setShowModal(false)}
                           className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                           <X className="w-5 h-5" />
                        </button>
                     </div>

                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Name
                           </label>
                           <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Description
                           </label>
                           <textarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Category Type
                           </label>
                           <select
                              value={formData.category_type}
                              onChange={(e) => setFormData({ ...formData, category_type: e.target.value as 'post' | 'product', parent_id: '' })}
                              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                           >
                              <option value="post">Post Category</option>
                              <option value="product">Product Category</option>
                           </select>
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Color
                           </label>
                           <input
                              type="color"
                              value={formData.color}
                              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                              className="w-full h-10 border border-gray-200 dark:border-gray-700 rounded-lg"
                           />
                        </div>

                        {/* Parent Category Dropdown */}
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Parent Category
                           </label>
                           <select
                              value={formData.parent_id}
                              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                           >
                              <option value="">None</option>
                              {getParentCategoriesOptions().map((cat) => (
                                 <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                 </option>
                              ))}
                           </select>
                        </div>

                        {/* Featured Image Upload */}
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Featured Image
                           </label>
                           <MediaUploadButton onChange={urls => setFormData({ ...formData, featured_image: urls[0] })} buttonText="Select Featured Image" />
                        </div>

                        {/* Sections Editor (reuse Post Section tab) */}
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Sections
                           </label>
                           <SectionEditor
                              sections={formData.sections}
                              onChange={(sections) => setFormData({ ...formData, sections })}
                           />
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                           <button
                              type="button"
                              onClick={() => setShowModal(false)}
                              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                           >
                              Cancel
                           </button>
                           <button
                              type="submit"
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                           >
                              <Save className="w-4 h-4" />
                              <span>{editingCategory ? "Update" : "Create"}</span>
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default Categories;