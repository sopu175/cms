import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ShoppingBag,
  DollarSign,
  Package,
  Star,
  Eye,
  X,
  Save,
  Image,
  Upload,
  FileText,
  Layers,
  List
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { useCategories } from '../hooks/useCategories';
import { Product, ProductVariation, ContentBlock, PostSection } from '../types';
import ContentBlockEditor from './ContentBlockEditor';
import PostSectionEditor from './PostSectionEditor';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Products: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const { products, loading, createProduct, updateProduct, deleteProduct, getProductVariations, createProductVariation, updateProductVariation, deleteProductVariation } = useProducts({
    status: statusFilter
  });
  const { categories } = useCategories();
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [editingVariation, setEditingVariation] = useState<ProductVariation | null>(null);
  const [productVariations, setProductVariations] = useState<ProductVariation[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaCallback, setMediaCallback] = useState<((url: string) => void) | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    images: [] as string[],
    price: 0,
    category_id: '',
    status: 'active',
    content_blocks: [] as ContentBlock[],
    sections: [] as PostSection[]
  });

  const [variationForm, setVariationForm] = useState({
    product_id: '',
    sku: '',
    options: {} as Record<string, string>,
    price: 0,
    stock: 0,
    status: 'active'
  });

  const [optionKeys, setOptionKeys] = useState<string[]>(['color']);
  const [optionValues, setOptionValues] = useState<Record<string, string>>({
    color: ''
  });

  useEffect(() => {
    // Create demo products if none exist
    if (products.length === 0 && !loading) {
      createDemoProducts();
    }
  }, [products, loading]);

  const createDemoProducts = async () => {
    // Get categories
    if (categories.length === 0) return;
    
    const demoProducts = [
      {
        name: 'Professional DSLR Camera',
        slug: 'professional-dslr-camera',
        description: 'High-quality professional DSLR camera with advanced features for photography enthusiasts.',
        images: ['https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg'],
        price: 1299.99,
        category_id: categories[0].id,
        status: 'active',
        content_blocks: [
          {
            id: '1',
            type: 'rich_text',
            content: '<h2>Professional Quality</h2><p>This camera offers exceptional image quality and performance for professional photographers.</p>',
            order: 0
          },
          {
            id: '2',
            type: 'image',
            content: {
              url: 'https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg',
              alt: 'Camera in action',
              caption: 'Capture every moment with stunning clarity'
            },
            order: 1
          }
        ],
        sections: [
          {
            id: '1',
            title: 'Technical Specifications',
            type: 'section',
            content: '<ul><li>24.2 Megapixel CMOS Sensor</li><li>4K Video Recording</li><li>ISO Range: 100-25600</li><li>Built-in Wi-Fi and Bluetooth</li></ul>',
            order: 0
          }
        ]
      },
      {
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: 'Premium noise-cancelling wireless headphones with long battery life and superior sound quality.',
        images: ['https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg'],
        price: 249.99,
        category_id: categories[0].id,
        status: 'active',
        content_blocks: [
          {
            id: '1',
            type: 'rich_text',
            content: '<h2>Immersive Sound Experience</h2><p>Experience crystal clear audio with deep bass and noise cancellation technology.</p>',
            order: 0
          }
        ],
        sections: [
          {
            id: '1',
            title: 'Features',
            type: 'section',
            content: '<ul><li>Active Noise Cancellation</li><li>30-hour Battery Life</li><li>Quick Charge: 5 min = 3 hours playback</li><li>Bluetooth 5.0</li></ul>',
            order: 0
          }
        ]
      }
    ];
    
    for (const product of demoProducts) {
      await createProduct(product);
    }
  };

  const canEdit = ['admin', 'editor'].includes(user?.role || '');

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      images: [],
      price: 0,
      category_id: '',
      status: 'active',
      content_blocks: [],
      sections: []
    });
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleEdit = async (product: Product) => {
    setEditingProduct(product);
    
    // Fetch variations
    const result = await getProductVariations(product.id);
    if (result.success) {
      setProductVariations(result.data || []);
    } else {
      setProductVariations([]);
    }
    
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      images: product.images || [],
      price: product.price,
      category_id: product.category_id || '',
      status: product.status,
      content_blocks: product.content_blocks || [],
      sections: product.sections || []
    });
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const result = await deleteProduct(productId);
    if (!result.success) {
      alert(result.error || 'Failed to delete product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug if empty
    let slug = formData.slug;
    if (!slug) {
      slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    
    const productData = {
      ...formData,
      slug
    };

    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, productData);
    } else {
      result = await createProduct(productData);
    }

    if (result.success) {
      setShowModal(false);
      setEditingProduct(null);
    } else {
      alert(result.error || 'Failed to save product');
    }
  };

  const handleCreateVariation = () => {
    if (!editingProduct) return;
    
    setEditingVariation(null);
    setVariationForm({
      product_id: editingProduct.id,
      sku: '',
      options: optionKeys.reduce((acc, key) => ({ ...acc, [key]: '' }), {}),
      price: formData.price,
      stock: 0,
      status: 'active'
    });
    setShowVariationModal(true);
  };

  const handleEditVariation = (variation: ProductVariation) => {
    setEditingVariation(variation);
    setVariationForm({
      product_id: variation.product_id,
      sku: variation.sku,
      options: variation.options,
      price: variation.price,
      stock: variation.stock,
      status: variation.status
    });
    
    // Update option keys based on the variation
    const keys = Object.keys(variation.options);
    setOptionKeys(keys.length > 0 ? keys : ['color']);
    setShowVariationModal(true);
  };

  const handleDeleteVariation = async (variationId: string) => {
    if (!confirm('Are you sure you want to delete this variation?')) return;

    const result = await deleteProductVariation(variationId);
    if (result.success) {
      setProductVariations(productVariations.filter(v => v.id !== variationId));
    } else {
      alert(result.error || 'Failed to delete variation');
    }
  };

  const handleSubmitVariation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure all option values are set
    const options = { ...variationForm.options };
    optionKeys.forEach(key => {
      if (!options[key]) {
        options[key] = '';
      }
    });
    
    const variationData = {
      ...variationForm,
      options
    };

    let result;
    if (editingVariation) {
      result = await updateProductVariation(editingVariation.id, variationData);
    } else {
      result = await createProductVariation(variationData);
    }

    if (result.success) {
      if (editingVariation) {
        setProductVariations(productVariations.map(v => 
          v.id === editingVariation.id ? result.data : v
        ));
      } else {
        setProductVariations([...productVariations, result.data]);
      }
      setShowVariationModal(false);
      setEditingVariation(null);
    } else {
      alert(result.error || 'Failed to save variation');
    }
  };

  const addOptionKey = () => {
    setOptionKeys([...optionKeys, '']);
  };

  const updateOptionKey = (index: number, value: string) => {
    const newKeys = [...optionKeys];
    newKeys[index] = value;
    setOptionKeys(newKeys);
    
    // Update options object with new key
    const newOptions = { ...variationForm.options };
    const oldKey = Object.keys(newOptions)[index];
    if (oldKey && oldKey !== value) {
      const oldValue = newOptions[oldKey];
      delete newOptions[oldKey];
      if (value) {
        newOptions[value] = oldValue;
      }
    } else if (value && !newOptions[value]) {
      newOptions[value] = '';
    }
    
    setVariationForm({
      ...variationForm,
      options: newOptions
    });
  };

  const removeOptionKey = (index: number) => {
    const newKeys = [...optionKeys];
    const removedKey = newKeys[index];
    newKeys.splice(index, 1);
    setOptionKeys(newKeys);
    
    // Remove from options object
    const newOptions = { ...variationForm.options };
    if (removedKey && newOptions[removedKey]) {
      delete newOptions[removedKey];
    }
    
    setVariationForm({
      ...variationForm,
      options: newOptions
    });
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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
      case 'inactive': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'archived': return 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400';
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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Products</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your product catalog</p>
        </div>
        {canEdit && (
          <button 
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Product</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
          <option value="all">All Status</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              {product.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1 text-lg font-bold text-gray-900 dark:text-white">
                  <DollarSign className="w-4 h-4" />
                  <span>{product.price}</span>
                </div>
                {product.average_rating > 0 && (
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm">{product.average_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <Package className="w-4 h-4" />
                  <span>{product.variations_count || 0} variants</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{product.reviews_count || 0} reviews</span>
                </div>
              </div>

              {canEdit && (
                <div className="flex items-center justify-end space-x-2">
                  <button 
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first product to get started'}
          </p>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)} />
            
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl modal-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingProduct ? 'Edit Product' : 'New Product'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'basic'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'images'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Images
                </button>
                <button
                  onClick={() => setActiveTab('variations')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'variations'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Variations
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'content'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setActiveTab('blocks')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'blocks'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Content Blocks
                </button>
                <button
                  onClick={() => setActiveTab('sections')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'sections'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Sections
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            // Auto-generate slug if not editing
                            if (!editingProduct) {
                              const slug = e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9\s-]/g, '')
                                .replace(/\s+/g, '-')
                                .replace(/-+/g, '-')
                                .trim();
                              setFormData(prev => ({ ...prev, slug }));
                            }
                          }}
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
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Price
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                            $
                          </span>
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                            className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          value={formData.category_id}
                          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'images' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Images
                      </label>
                      <div className="flex items-center space-x-2 mb-4">
                        <input
                          type="url"
                          placeholder="Image URL"
                          className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              if (input.value) {
                                setFormData({
                                  ...formData,
                                  images: [...formData.images, input.value]
                                });
                                input.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleMediaSelect((url) => {
                            setFormData({
                              ...formData,
                              images: [...formData.images, url]
                            });
                          })}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Image className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...formData.images];
                                newImages.splice(index, 1);
                                setFormData({ ...formData, images: newImages });
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'variations' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Product Variations</h4>
                      <button
                        type="button"
                        onClick={handleCreateVariation}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Variation</span>
                      </button>
                    </div>

                    {productVariations.length > 0 ? (
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SKU</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Options</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {productVariations.map((variation) => (
                              <tr key={variation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{variation.sku}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                  {Object.entries(variation.options).map(([key, value]) => (
                                    <span key={key} className="inline-block px-2 py-1 mr-2 mb-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                      {key}: {value}
                                    </span>
                                  ))}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">${variation.price}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{variation.stock}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(variation.status)}`}>
                                    {variation.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => handleEditVariation(variation)}
                                      className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteVariation(variation.id)}
                                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No variations added yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add variations for different options like color, size, etc.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Content
                      </label>
                      <div className="bg-white dark:bg-gray-800 rounded-lg">
                        <ReactQuill
                          value={formData.description}
                          onChange={(content) => setFormData({ ...formData, description: content })}
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
                              ['clean']
                            ]
                          }}
                          formats={[
                            'header', 'bold', 'italic', 'underline', 'strike',
                            'list', 'bullet', 'script', 'indent', 'direction',
                            'color', 'background', 'align', 'link', 'image', 'video'
                          ]}
                          placeholder="Write detailed product description here..."
                          style={{ minHeight: '300px' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'blocks' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Content Blocks
                      </label>
                      <ContentBlockEditor
                        blocks={formData.content_blocks}
                        onChange={(blocks) => setFormData({ ...formData, content_blocks: blocks })}
                        onMediaSelect={handleMediaSelect}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'sections' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sections
                      </label>
                      <PostSectionEditor
                        sections={formData.sections}
                        onChange={(sections) => setFormData({ ...formData, sections: sections })}
                        onMediaSelect={handleMediaSelect}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                    <span>{editingProduct ? 'Update' : 'Create'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Variation Modal */}
      {showVariationModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowVariationModal(false)} />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl modal-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingVariation ? 'Edit Variation' : 'Add Variation'}
                </h3>
                <button
                  onClick={() => setShowVariationModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitVariation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={variationForm.sku}
                    onChange={(e) => setVariationForm({ ...variationForm, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Options
                    </label>
                    <button
                      type="button"
                      onClick={addOptionKey}
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      + Add Option
                    </button>
                  </div>
                  
                  {optionKeys.map((key, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => updateOptionKey(index, e.target.value)}
                        className="w-1/3 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Option name"
                      />
                      <input
                        type="text"
                        value={variationForm.options[key] || ''}
                        onChange={(e) => {
                          const newOptions = { ...variationForm.options };
                          newOptions[key] = e.target.value;
                          setVariationForm({ ...variationForm, options: newOptions });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Option value"
                      />
                      {optionKeys.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOptionKey(index)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                        $
                      </span>
                      <input
                        type="number"
                        value={variationForm.price}
                        onChange={(e) => setVariationForm({ ...variationForm, price: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={variationForm.stock}
                      onChange={(e) => setVariationForm({ ...variationForm, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={variationForm.status}
                    onChange={(e) => setVariationForm({ ...variationForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowVariationModal(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingVariation ? 'Update' : 'Add'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Media Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-70 overflow-y-auto">
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
                {/* This would typically fetch from your media library */}
                {[
                  'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg',
                  'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg',
                  'https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg',
                  'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'
                ].map((url, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (mediaCallback) {
                        mediaCallback(url);
                        setMediaCallback(null);
                        setShowMediaModal(false);
                      }
                    }}
                    className="relative group cursor-pointer hover:opacity-75 transition-opacity"
                  >
                    <img
                      src={url}
                      alt={`Media ${index + 1}`}
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

export default Products;