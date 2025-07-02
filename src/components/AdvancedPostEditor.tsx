import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Save, 
  X, 
  Eye,
  Settings,
  Image,
  FileText,
  Layers,
  List,
  Plus,
  Upload,
  FolderOpen
} from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useMedia } from '../hooks/useMedia';
import { Post, GalleryItem } from '../types';
import ContentBlockEditor from './ContentBlockEditor';
import PostSectionEditor from './PostSectionEditor';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../contexts/AuthContext';
import { useGalleries } from '../hooks/useGalleries';
import MediaUploadButton from './MediaUploadButton';

interface AdvancedPostEditorProps {
  post?: Post;
  onSave: (data: Post) => Promise<{ success: boolean; error?: string; data?: Partial<Post> }>;
  onCancel: () => void;
}

const AdvancedPostEditor: React.FC<AdvancedPostEditorProps> = ({ post, onSave, onCancel }) => {
  const { categories } = useCategories();
  const { media, uploadMedia } = useMedia();
  const { user } = useAuth();
  const { galleries } = useGalleries();
  const [activeTab, setActiveTab] = useState('content');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaCallback, setMediaCallback] = useState<((url: string) => void) | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Post>({
    id: post?.id || '',
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    featured_image: post?.featured_image || '',
    category_id: typeof post?.category_id === 'string' && post.category_id !== '' ? post.category_id : undefined,
    status: post?.status || 'draft',
    scheduled_at: typeof post?.scheduled_at === 'string' && post.scheduled_at !== '' ? post.scheduled_at : undefined,
    content_blocks: post?.content_blocks || [],
    sections: post?.sections || [],
    gallery_images: post?.gallery_images || [],
    video_url: post?.video_url || '',
    audio_url: post?.audio_url || '',
    tags: post?.tags || [],
    is_featured: post?.is_featured || false,
    allow_comments: post?.allow_comments !== false,
    views: post?.views || 0,
    created_at: post?.created_at || new Date().toISOString(),
    updated_at: post?.updated_at || new Date().toISOString(),
    author_id: post?.author_id || (user?.id && user.id !== '' ? user.id : undefined),
    gallery_id: typeof post?.gallery_id === 'string' && post.gallery_id !== '' ? post.gallery_id : undefined,
  });

  const [seoData, setSeoData] = useState({
    seo_title: post?.seo_title || '',
    seo_description: post?.seo_description || '',
    seo_keywords: post?.seo_keywords || [],
    canonical_url: post?.canonical_url || '',
    og_image: post?.og_image || '',
    robots: post?.robots || 'index,follow'
  });

  // Track the current folder path as an array of folder ids
  const [galleryPath, setGalleryPath] = useState<string[]>([]);

  // Helper to get the current folder's children
  const getCurrentGalleryItems = (): GalleryItem[] => {
    const items = formData.gallery_images || [];
    let currentItems = items;
    for (const folderId of galleryPath) {
      const folder = currentItems.find(item => item.type === 'folder' && item.id === folderId);
      if (folder && folder.children) {
        currentItems = folder.children;
      } else {
        break;
      }
    }
    return currentItems;
  };

  // Helper to update gallery_images tree immutably
  const updateGalleryAtPath = (path: string[], updater: (items: GalleryItem[]) => GalleryItem[]) => {
    if (path.length === 0) {
      setFormData(prev => ({ ...prev, gallery_images: updater(prev.gallery_images || []) }));
      return;
    }
    setFormData(prev => {
      const updateRecursive = (items: GalleryItem[], depth: number): GalleryItem[] => {
        return items.map(item => {
          if (item.type === 'folder' && item.id === path[depth]) {
            if (depth === path.length - 1) {
              return { ...item, children: updater(item.children || []) };
            } else {
              return { ...item, children: updateRecursive(item.children || [], depth + 1) };
            }
          }
          return item;
        });
      };
      return {
        ...prev,
        gallery_images: updateRecursive(prev.gallery_images || [], 0)
      };
    });
  };

  // Add folder to current path
  const handleAddFolder = () => {
    const name = prompt('Folder name?');
    if (!name) return;
    const newFolder: GalleryItem = { id: uuidv4(), type: 'folder', name, children: [] };
    updateGalleryAtPath(galleryPath, items => [...items, newFolder]);
  };

  // Upload image to current path
  const handleUploadImage = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadMedia(file);
      if (result.success && result.data) {
        const newImage: GalleryItem = { id: uuidv4(), type: 'image', url: result.data.url };
        updateGalleryAtPath(galleryPath, items => [...items, newImage]);
      }
    } finally {
      setUploading(false);
    }
  };

  // Handle upload button click
  const handleUploadClickGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleUploadImage(file);
      }
    };
    input.click();
  };

  // Navigate into a folder
  const handleEnterFolder = (folderId: string) => {
    setGalleryPath(path => [...path, folderId]);
  };

  // Navigate up
  const handleGoUp = () => {
    setGalleryPath(path => path.slice(0, -1));
  };

  // Breadcrumbs
  const renderGalleryBreadcrumbs = () => {
    let items = formData.gallery_images || [];
    const crumbs = [
      <span key="root" className="cursor-pointer text-blue-400" onClick={() => setGalleryPath([])}>Gallery</span>
    ];
    let currentPath: string[] = [];
    for (const folderId of galleryPath) {
      const folder = items.find((item: any) => item.type === 'folder' && item.id === folderId);
      if (!folder) break;
      currentPath = [...currentPath, folderId];
      crumbs.push(
        <span key={folderId} className="mx-2 text-gray-400">/</span>,
        <span key={folderId + '-crumb'} className="cursor-pointer text-blue-400" onClick={() => setGalleryPath(currentPath)}>{folder.name}</span>
      );
      items = folder.children || [];
    }
    return <div className="mb-4 flex items-center flex-wrap">{crumbs}</div>;
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !post) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Sanitize UUID/timestamp fields before sending to backend
    const postData: Partial<Post> = {
      ...formData,
      title: formData.title || '',
      slug: formData.slug || '',
      content: formData.content || '',
      status: formData.status || 'draft',
      published_at: formData.status === 'published' ? new Date().toISOString() : undefined,
      author_id: formData.author_id && formData.author_id !== '' ? formData.author_id : undefined,
      category_id: formData.category_id && formData.category_id !== '' ? formData.category_id : undefined,
      scheduled_at: formData.scheduled_at && formData.scheduled_at !== '' ? formData.scheduled_at : undefined
    };
    if ('id' in postData && !postData.id) {
      delete postData.id;
    }
    console.log('Submitting postData:', postData);
    const result = await onSave(postData as Post);
    if (result.success && result.data) {
      setFormData(prev => ({ ...prev, ...result.data }));
      // Optionally, show a success message or keep the modal open
    } else if (result.error) {
      setError(result.error);
    }
  };

  const handleMediaSelect = (callback: (url: string) => void) => {
    setMediaCallback(() => callback);
    setShowMediaModal(true);
  };

  const selectMedia = (mediaItem: any) => {
    if (mediaCallback) {
      mediaCallback(mediaItem.url);
      setMediaCallback(null);
    }
    setShowMediaModal(false);
  };

  const handleFileUpload = async (file: File, callback?: (url: string) => void) => {
    try {
      setUploading(true);
      const result = await uploadMedia(file);
      if (result.success && result.data) {
        if (callback) {
          callback(result.data.url);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = (callback: (url: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file, callback);
      }
    };
    input.click();
  };

  // Get hierarchical categories for display
  const getHierarchicalCategories = () => {
    const categoryMap = new Map();
    const rootCategories: any[] = [];
    
    // First pass: create map and identify root categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
      if (!category.parent_id) {
        rootCategories.push(category.id);
      }
    });
    
    // Second pass: build hierarchy
    categories.forEach(category => {
      if (category.parent_id && categoryMap.has(category.parent_id)) {
        categoryMap.get(category.parent_id).children.push(categoryMap.get(category.id));
      }
    });
    
    return rootCategories.map(id => categoryMap.get(id));
  };

  const renderCategoryOptions = (categories: any[], level = 0) => {
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <option value={category.id}>
          {'—'.repeat(level)} {category.name}
        </option>
        {category.children && category.children.length > 0 && 
          renderCategoryOptions(category.children, level + 1)
        }
      </React.Fragment>
    ));
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'blocks', label: 'Content Blocks', icon: Layers },
    { id: 'sections', label: 'Sections', icon: List },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'seo', label: 'SEO', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Add this handler for browsing and adding an image from media modal to the current folder
  const handleBrowseGallery = () => {
    handleMediaSelect((url) => {
      const newImage: GalleryItem = { id: uuidv4(), type: 'image', url };
      updateGalleryAtPath(galleryPath, items => [...items, newImage]);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {post ? 'Edit Post' : 'Create New Post'}
            </h2>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg"
              >
                <Save className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Save Post'}</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap space-x-4 mt-4 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="max-w-2xl mx-auto mt-6 mb-2 p-4 bg-red-100 text-red-800 rounded-lg border border-red-300">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <div className="max-w-6xl mx-auto">
            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Basic Fields */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Slug
                        </label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Gallery
                        </label>
                        <select
                          value={formData.gallery_id || ''}
                          onChange={e => setFormData({ ...formData, gallery_id: e.target.value || undefined })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="">No Gallery</option>
                          {galleries.map(gallery => (
                            <option key={gallery.id} value={gallery.id}>{gallery.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Excerpt
                        </label>
                        <textarea
                          value={formData.excerpt}
                          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Content
                        </label>
                        <div className="bg-white dark:bg-gray-800 rounded-lg">
                          <ReactQuill
                            className="my-quill-editor"
                            value={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                            modules={{
                              toolbar: [
                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                [{ 'script': 'sub'}, { 'script': 'super' }],
                                [{ 'indent': '-1'}, { 'indent': '+1' }],
                                [{ 'direction': 'rtl' }],
                                [{ 'color': [] }, { 'background': [] }],
                                [{ 'align': [] }],
                                ['link', 'image', 'video'],
                                ['blockquote', 'code-block'],
                                ['clean']
                              ]
                            }}
                            formats={[
                              'header', 'bold', 'italic', 'underline', 'strike',
                              'list', 'bullet', 'script', 'indent', 'direction',
                              'color', 'background', 'align', 'link', 'image', 'video',
                              'blockquote', 'code-block'
                            ]}
                            placeholder="Write your post content here..."
                            style={{ minHeight: '300px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'blocks' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Content Blocks</h3>
                {formData.content_blocks && (
                  <ContentBlockEditor
                    blocks={formData.content_blocks}
                    onChange={(blocks) => setFormData({ ...formData, content_blocks: blocks })}
                    onMediaSelect={handleMediaSelect}
                  />
                )}
              </div>
            )}

            {activeTab === 'sections' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Sections</h3>
                {formData.sections && (
                  <PostSectionEditor
                    sections={formData.sections}
                    onChange={(sections) => setFormData({ ...formData, sections: sections })}
                    onMediaSelect={handleMediaSelect}
                  />
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6">
                {/* Featured Image */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Featured Image</h3>
                  <div className="flex items-center space-x-4">
                    <MediaUploadButton onChange={urls => setFormData({ ...formData, featured_image: urls[0] })} buttonText="Select Featured Image" />
                  </div>
                  {formData.featured_image && (
                    <div className="mt-4">
                      <img
                        src={formData.featured_image}
                        alt="Featured"
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Nested Gallery */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gallery</h3>
                    <MediaUploadButton onChange={urls => updateGalleryAtPath(galleryPath, items => [...items, ...urls.map(url => ({ id: uuidv4(), type: 'image' as const, url }))])} buttonText="Add Images" />
                  </div>
                  {renderGalleryBreadcrumbs()}
                  {galleryPath.length > 0 && (
                    <button onClick={handleGoUp} className="mb-4 text-blue-400 hover:underline">Back</button>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Add Folder Button */}
                    <div className="relative group cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                      onClick={handleAddFolder}
                    >
                      <Plus className="w-8 h-8 text-blue-400 mb-2" />
                      <span className="text-gray-900 dark:text-white font-semibold">Add Folder</span>
                    </div>
                    
                    {getCurrentGalleryItems().map((item, index) => (
                      item.type === 'folder' ? (
                        <div key={item.id} className="relative group cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                          onClick={() => handleEnterFolder(item.id)}
                        >
                          <FolderOpen className="w-8 h-8 text-blue-400 mb-2" />
                          <span className="text-gray-900 dark:text-white font-semibold">{item.name}</span>
                        </div>
                      ) : (
                        <div key={item.id} className="relative group">
                          <img
                            src={item.url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {/* Video & Audio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Video URL</h3>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="YouTube, Vimeo, or direct video URL"
                    />
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Audio URL</h3>
                    <input
                      type="url"
                      value={formData.audio_url}
                      onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Direct audio file URL"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={seoData.seo_title}
                      onChange={(e) => setSeoData({ ...seoData, seo_title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Leave empty to use post title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={seoData.seo_description}
                      onChange={(e) => setSeoData({ ...seoData, seo_description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Brief description for search engines"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      value={seoData.seo_keywords?.join(', ') || ''}
                      onChange={(e) => setSeoData({ 
                        ...seoData, 
                        seo_keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                      })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      value={seoData.canonical_url}
                      onChange={(e) => setSeoData({ ...seoData, canonical_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://example.com/canonical-url"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Open Graph Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <MediaUploadButton onChange={urls => setSeoData({ ...seoData, og_image: urls[0] })} buttonText="Select Open Graph Image" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Post Settings</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value || undefined })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">Select Category</option>
                        {renderCategoryOptions(getHierarchicalCategories())}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Post['status'] })}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </div>

                    {formData.status === 'scheduled' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Scheduled Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.scheduled_at}
                          onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.tags?.join(', ') || ''}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Featured Post
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Mark this post as featured
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Allow Comments
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Enable comments for this post
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.allow_comments}
                          onChange={(e) => setFormData({ ...formData, allow_comments: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowMediaModal(false)} />
            
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl modal-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Media</h3>
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
                {media.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectMedia(item)}
                    className="relative group cursor-pointer hover:opacity-75 transition-opacity"
                  >
                    <img
                      src={item.url}
                      alt={item.alt_text || item.original_name}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all" />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedPostEditor;