import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  Video,
  Grid,
  List,
  X,
  Save,
  Eye
} from 'lucide-react';
import { useGalleries } from '../hooks/useGalleries';
import { useAuth } from '../contexts/AuthContext';
import { Gallery as GalleryType, GalleryItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useMedia } from '../hooks/useMedia';
import MediaUploadButton from './MediaUploadButton';

const Gallery: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryType | null>(null);
  const { galleries, loading, createGallery, updateGallery, deleteGallery } = useGalleries();
  const { uploadMedia } = useMedia();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    type: 'image' as 'image' | 'video' | 'mixed',
    items: [] as GalleryItem[],
    status: 'active'
  });

  const [galleryPath, setGalleryPath] = useState<string[]>([]);

  const canEdit = ['admin', 'editor', 'author'].includes(user?.role || '');

  const handleCreate = () => {
    setEditingGallery(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      type: 'image',
      items: [],
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEdit = (gallery: GalleryType) => {
    setEditingGallery(gallery);
    setFormData({
      name: gallery.name,
      slug: gallery.slug,
      description: gallery.description || '',
      type: gallery.type,
      items: gallery.items,
      status: gallery.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const galleryData = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      created_by: user?.id
    };

    let result;
    if (editingGallery) {
      result = await updateGallery(editingGallery.id, galleryData);
    } else {
      result = await createGallery(galleryData);
    }

    if (result.success) {
      setShowModal(false);
      setEditingGallery(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        type: 'image',
        items: [],
        status: 'active'
      });
    } else {
      alert(result.error || 'Failed to save gallery');
    }
  };

  const handleDelete = async (galleryId: string) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;

    const result = await deleteGallery(galleryId);
    if (!result.success) {
      alert(result.error || 'Failed to delete gallery');
    }
  };

  const getCurrentGalleryItems = (): GalleryItem[] => {
    const items = formData.items || [];
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

  const updateGalleryAtPath = (path: string[], updater: (items: GalleryItem[]) => GalleryItem[]) => {
    if (path.length === 0) {
      setFormData(prev => ({ ...prev, items: updater(prev.items || []) }));
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
        items: updateRecursive(prev.items || [], 0)
      };
    });
  };

  const handleAddFolder = () => {
    const name = prompt('Folder name?');
    if (!name) return;
    const newFolder: GalleryItem = { id: uuidv4(), type: 'folder', name, children: [] };
    updateGalleryAtPath(galleryPath, items => [...items, newFolder]);
  };

  const handleUploadImage = async (file: File) => {
    const result = await uploadMedia(file);
    if (result.success && result.data) {
      const newImage: GalleryItem = { id: uuidv4(), type: 'image', url: result.data.url };
      updateGalleryAtPath(galleryPath, items => [...items, newImage]);
    }
  };

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

  const handleEnterFolder = (folderId: string) => {
    setGalleryPath(path => [...path, folderId]);
  };

  const handleGoUp = () => {
    setGalleryPath(path => path.slice(0, -1));
  };

  const renderGalleryBreadcrumbs = () => {
    let items = formData.items || [];
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

  const filteredGalleries = galleries.filter(gallery => {
    const matchesSearch = gallery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gallery.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || gallery.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'mixed': return Grid;
      default: return ImageIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400';
      case 'mixed': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      default: return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
    }
  };

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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Galleries</h2>
          <p className="text-gray-600 dark:text-gray-400">Organize your media into collections</p>
        </div>
        {canEdit && (
          <button 
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Gallery</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search galleries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="mixed">Mixed</option>
          </select>

          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Galleries */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGalleries.map((gallery) => {
            const TypeIcon = getTypeIcon(gallery.type);
            
            return (
              <div
                key={gallery.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Gallery Preview */}
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                  {gallery.items.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1 h-full">
                      {gallery.items.slice(0, 4).map((item, index) => (
                        <img
                          key={index}
                          src={item.url}
                          alt={`${gallery.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getTypeColor(gallery.type)}`}>
                      {gallery.type}
                    </span>
                  </div>
                  {gallery.items.length > 4 && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      +{gallery.items.length - 4} more
                    </div>
                  )}
                </div>

                {/* Gallery Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{gallery.name}</h3>
                  {gallery.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {gallery.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{gallery.items.length} items</span>
                    <span>{new Date(gallery.created_at).toLocaleDateString()}</span>
                  </div>

                  {canEdit && (
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(gallery)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(gallery.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Gallery</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredGalleries.map((gallery) => {
                  const TypeIcon = getTypeIcon(gallery.type);
                  
                  return (
                    <tr key={gallery.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            {gallery.items.length > 0 ? (
                              <img
                                src={gallery.items[0].url}
                                alt={gallery.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <TypeIcon className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{gallery.name}</p>
                            {gallery.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {gallery.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getTypeColor(gallery.type)}`}>
                          {gallery.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {gallery.items.length}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(gallery.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {canEdit && (
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit(gallery)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(gallery.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredGalleries.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No galleries found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first gallery to get started'}
          </p>
        </div>
      )}

      {/* Gallery Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)} />
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingGallery ? 'Edit Gallery' : 'New Gallery'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' | 'mixed' })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="image">Images</option>
                      <option value="video">Videos</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Items ({getCurrentGalleryItems().length})
                    </label>
                    <div className="flex items-center space-x-2 mb-4">
                      <button
                        type="button"
                        onClick={handleAddFolder}
                        className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Folder</span>
                      </button>
                      <MediaUploadButton onChange={urls => updateGalleryAtPath(galleryPath, items => [...items, ...urls.map(url => ({ id: uuidv4(), type: 'image' as const, url }))])} buttonText="Add Images to Folder" />
                    </div>
                  </div>
                  {renderGalleryBreadcrumbs()}
                  {galleryPath.length > 0 && (
                    <button
                      type="button"
                      onClick={handleGoUp}
                      className="mb-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Go Up
                    </button>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                    {getCurrentGalleryItems().map((item, index) => (
                      item.type === 'folder' ? (
                        <div key={item.id} className="relative group cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                          onClick={() => handleEnterFolder(item.id)}
                        >
                          <Grid className="w-8 h-8 text-blue-400 mb-2" />
                          <span className="text-gray-900 dark:text-white font-semibold">{item.name}</span>
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); updateGalleryAtPath(galleryPath, items => items.filter(f => f.id !== item.id)); }}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div key={item.id} className="relative group">
                          <img
                            src={item.url}
                            alt={`Gallery item ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => updateGalleryAtPath(galleryPath, items => items.filter(img => img.id !== item.id))}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    ))}
                  </div>
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
                    <span>{editingGallery ? 'Update' : 'Create'}</span>
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

export default Gallery;