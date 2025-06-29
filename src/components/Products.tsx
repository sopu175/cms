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
  Upload,
  Image as ImageIcon,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  List,
  FileText
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../contexts/AuthContext';
import { Product, ProductVariation, ContentBlock, PostSection } from '../types';
import ContentBlockEditor from './ContentBlockEditor';
import PostSectionEditor from './PostSectionEditor';

const Products: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const { 
    products, 
    loading, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getProductVariations,
    createProductVariation,
    updateProductVariation,
    deleteProductVariation
  } = useProducts({
    status: statusFilter
  });
  const { categories } = useCategories();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [editingVariation, setEditingVariation] = useState<ProductVariation | null>(null);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [productVariations, setProductVariations] = useState<ProductVariation[]>([]);
  const [loadingVariations, setLoadingVariations] = useState(false);
  const [showVariationsList, setShowVariationsList] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

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

  const [variationData, setVariationData] = useState({
    sku: '',
    options: {} as Record<string, string>,
    price: 0,
    stock: 0,
    status: 'active'
  });

  const [optionKeys, setOptionKeys] = useState<string[]>(['color', 'size']);
  const [newOptionKey, setNewOptionKey] = useState('');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaCallback, setMediaCallback] = useState<((url: string) => void) | null>(null);

  const canEdit = ['admin', 'editor'].includes(user?.role || '');

  useEffect(() => {
    // Add demo products if none exist
    if (products.length === 0 && !loading) {
      addDemoProducts();
    }
  }, [products, loading]);

  const addDemoProducts = async () => {
    // Get category IDs
    const techCategory = categories.find(c => c.slug === 'technology')?.id;
    const lifestyleCategory = categories.find(c => c.slug === 'lifestyle')?.id;
    
    // Demo products
    const demoProducts = [
      {
        name: 'Premium Laptop',
        slug: 'premium-laptop',
        description: 'High-performance laptop with the latest processor and ample storage.',
        images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
        price: 1299.99,
        category_id: techCategory || '',
        status: 'active',
        content_blocks: [
          {
            id: '1',
            type: 'rich_text',
            content: '<h2>Premium Laptop Features</h2><ul><li>Latest generation processor</li><li>16GB RAM</li><li>512GB SSD storage</li><li>15.6" 4K display</li><li>Backlit keyboard</li></ul>',
            order: 0
          },
          {
            id: '2',
            type: 'image',
            content: {
              url: 'https://images.pexels.com/photos/459653/pexels-photo-459653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              alt: 'Laptop keyboard closeup',
              caption: 'Ergonomic backlit keyboard for comfortable typing'
            },
            order: 1
          }
        ],
        sections: [
          {
            id: '1',
            title: 'Technical Specifications',
            type: 'section',
            content: '<h3>Technical Specifications</h3><table><tr><td>Processor</td><td>Intel Core i7-12700H</td></tr><tr><td>Memory</td><td>16GB DDR4</td></tr><tr><td>Storage</td><td>512GB NVMe SSD</td></tr><tr><td>Display</td><td>15.6" 4K UHD (3840 x 2160)</td></tr><tr><td>Graphics</td><td>NVIDIA GeForce RTX 3060 6GB</td></tr><tr><td>Battery</td><td>Up to 10 hours</td></tr></table>',
            order: 0
          },
          {
            id: '2',
            title: 'What\'s in the Box',
            type: 'section',
            content: '<h3>What\'s in the Box</h3><ul><li>Premium Laptop</li><li>Power adapter</li><li>Quick start guide</li><li>Warranty information</li></ul>',
            order: 1
          }
        ]
      },
      {
        name: 'Wireless Earbuds',
        slug: 'wireless-earbuds',
        description: 'True wireless earbuds with active noise cancellation and long battery life.',
        images: ['https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
        price: 149.99,
        category_id: techCategory || '',
        status: 'active',
        content_blocks: [
          {
            id: '1',
            type: 'rich_text',
            content: '<h2>Wireless Earbuds Features</h2><ul><li>Active noise cancellation</li><li>8 hours of playback time</li><li>24 hours with charging case</li><li>Water and sweat resistant</li><li>Touch controls</li></ul>',
            order: 0
          }
        ],
        sections: [
          {
            id: '1',
            title: 'Sound Quality',
            type: 'section',
            content: '<h3>Superior Sound Quality</h3><p>Experience crystal clear audio with deep bass and crisp highs. The advanced audio drivers deliver an immersive listening experience for music, podcasts, and calls.</p>',
            order: 0
          }
        ]
      }
    ];
    
    // Create demo products
    for (const product of demoProducts) {
      const result = await createProduct(product);
      
      if (result.success && result.data) {
        // Add variations for the product
        if (product.name === 'Premium Laptop') {
          await createProductVariation({
            product_id: result.data.id,
            sku: 'LAPTOP-16GB-512GB',
            options: { memory: '16GB', storage: '512GB' },
            price: 1299.99,
            stock: 10,
            status: 'active'
          });
          
          await createProductVariation({
            product_id: result.data.id,
            sku: 'LAPTOP-32GB-1TB',
            options: { memory: '32GB', storage: '1TB' },
            price: 1599.99,
            stock: 5,
            status: 'active'
          });
        } else if (product.name === 'Wireless Earbuds') {
          await createProductVariation({
            product_id: result.data.id,
            sku: 'EARBUDS-BLACK',
            options: { color: 'Black' },
            price: 149.99,
            stock: 20,
            status: 'active'
          });
          
          await createProductVariation({
            product_id: result.data.id,
            sku: 'EARBUDS-WHITE',
            options: { color: 'White' },
            price: 149.99,
            stock: 15,
            status: 'active'
          });
        }
      }
    }
    
    // Create demo orders
    // This would typically be done through the orders API
    console.log('Demo products and variations created');
  };

  const handleCreateProduct = () => {
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

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      price: Number(formData.price)
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

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const result = await deleteProduct(productId);
    if (!result.success) {
      alert(result.error || 'Failed to delete product');
    }
  };

  const handleAddImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddOption = () => {
    if (newOptionKey && !optionKeys.includes(newOptionKey)) {
      setOptionKeys([...optionKeys, newOptionKey]);
      setNewOptionKey('');
    }
  };

  const handleRemoveOption = (key: string) => {
    setOptionKeys(optionKeys.filter(k => k !== key));
    setVariationData(prev => {
      const newOptions = { ...prev.options };
      delete newOptions[key];
      return { ...prev, options: newOptions };
    });
  };

  const handleVariationChange = (key: string, value: string) => {
    setVariationData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [key]: value
      }
    }));
  };

  const handleManageVariations = async (productId: string) => {
    setCurrentProductId(productId);
    setLoadingVariations(true);
    
    try {
      const result = await getProductVariations(productId);
      if (result.success) {
        setProductVariations(result.data || []);
      } else {
        console.error('Failed to fetch variations:', result.error);
        setProductVariations([]);
      }
    } catch (error) {
      console.error('Error fetching variations:', error);
      setProductVariations([]);
    } finally {
      setLoadingVariations(false);
    }
    
    setShowVariationsList(true);
  };

  const handleCreateVariation = () => {
    setEditingVariation(null);
    setVariationData({
      sku: '',
      options: {},
      price: 0,
      stock: 0,
      status: 'active'
    });
    setShowVariationModal(true);
  };

  const handleEditVariation = (variation: ProductVariation) => {
    setEditingVariation(variation);
    setVariationData({
      sku: variation.sku,
      options: variation.options || {},
      price: variation.price,
      stock: variation.stock,
      status: variation.status
    });
    
    // Update option keys based on the variation's options
    const keys = Object.keys(variation.options || {});
    if (keys.length > 0) {
      setOptionKeys(keys);
    }
    
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

  const handleSaveVariation = async () => {
    if (!currentProductId) return;
    
    const variationToSave = {
      ...variationData,
      product_id: currentProductId,
      price: Number(variationData.price),
      stock: Number(variationData.stock)
    };
    
    let result;
    if (editingVariation) {
      result = await updateProductVariation(editingVariation.id, variationToSave);
    } else {
      result = await createProductVariation(variationToSave);
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
            onClick={handleCreateProduct}
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
                    onClick={() => handleManageVariations(product.id)}
                    className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors"
                    title="Manage Variations"
                  >
                    <Package className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditProduct(product)}
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
              <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'basic'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Basic Info</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('blocks')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'blocks'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4" />
                    <span>Content Blocks</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('sections')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'sections'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <List className="w-4 h-4" />
                    <span>Sections</span>
                  </div>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'basic' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Product Name
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
                          placeholder="auto-generated-if-empty"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            className="w-full pl-8 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Category</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
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
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Product Images
                        </label>
                        <button
                          type="button"
                          onClick={handleAddImage}
                          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Image</span>
                        </button>
                      </div>
                      
                      {formData.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No images added yet
                          </p>
                          <button
                            type="button"
                            onClick={handleAddImage}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                          >
                            Add product images
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTab === 'blocks' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Blocks</h3>
                    <ContentBlockEditor
                      blocks={formData.content_blocks}
                      onChange={(blocks) => setFormData({ ...formData, content_blocks: blocks })}
                      onMediaSelect={handleMediaSelect}
                    />
                  </div>
                )}

                {activeTab === 'sections' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sections</h3>
                    <PostSectionEditor
                      sections={formData.sections}
                      onChange={(sections) => setFormData({ ...formData, sections: sections })}
                      onMediaSelect={handleMediaSelect}
                    />
                  </div>
                )}

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
                    <span>{editingProduct ? 'Update' : 'Create'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Variations List Modal */}
      {showVariationsList && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowVariationsList(false)} />
            
            <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl modal-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Product Variations
                </h3>
                <button
                  onClick={() => setShowVariationsList(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loadingVariations ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={handleCreateVariation}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Variation</span>
                    </button>
                  </div>

                  {productVariations.length > 0 ? (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              SKU
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Options
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Stock
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {productVariations.map((variation) => (
                            <tr key={variation.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {variation.sku}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {Object.entries(variation.options || {}).map(([key, value]) => (
                                  <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300 mr-2">
                                    {key}: {value}
                                  </span>
                                ))}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                ${variation.price}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {variation.stock}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(variation.status)}`}>
                                  {variation.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleEditVariation(variation)}
                                    className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
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
                      <p className="text-gray-500 dark:text-gray-400">No variations found</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add variations to create different options for this product</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Variation Modal */}
      {showVariationModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowVariationModal(false)} />
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl modal-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingVariation ? 'Edit Variation' : 'New Variation'}
                </h3>
                <button
                  onClick={() => setShowVariationModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={variationData.sku}
                    onChange={(e) => setVariationData({ ...variationData, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Options
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newOptionKey}
                        onChange={(e) => setNewOptionKey(e.target.value)}
                        placeholder="New option key"
                        className="px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {optionKeys.map(key => (
                      <div key={key} className="flex items-center space-x-2">
                        <div className="flex-1 flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize w-20">
                            {key}:
                          </span>
                          <input
                            type="text"
                            value={variationData.options[key] || ''}
                            onChange={(e) => handleVariationChange(key, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder={`Enter ${key}`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(key)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        value={variationData.price}
                        onChange={(e) => setVariationData({ ...variationData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-8 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      value={variationData.stock}
                      onChange={(e) => setVariationData({ ...variationData, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={variationData.status}
                    onChange={(e) => setVariationData({ ...variationData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    type="button"
                    onClick={handleSaveVariation}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingVariation ? 'Update' : 'Create'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {/* This would typically be populated with media from your media library */}
                <div
                  onClick={() => selectMedia({ url: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' })}
                  className="relative group cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <img
                    src="https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Laptop"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
                <div
                  onClick={() => selectMedia({ url: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' })}
                  className="relative group cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <img
                    src="https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Earbuds"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
                <div
                  onClick={() => selectMedia({ url: 'https://images.pexels.com/photos/459653/pexels-photo-459653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' })}
                  className="relative group cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <img
                    src="https://images.pexels.com/photos/459653/pexels-photo-459653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Keyboard"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
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