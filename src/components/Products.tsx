import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ShoppingBag,
  Package,
  Star,
  Eye,
  X,
  Save,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { useCategories } from '../hooks/useCategories';
import { useSettings } from '../hooks/useSettings';
import { Product, ProductVariation, ContentBlock, PostSection } from '../types';
import ContentBlockEditor from './ContentBlockEditor';
import PostSectionEditor from './PostSectionEditor';

const Products: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const { products, loading, createProduct, updateProduct, deleteProduct, 
    getProductVariations, createProductVariation, updateProductVariation, deleteProductVariation } = useProducts({
    status: statusFilter
  });
  const { categories } = useCategories();
  const { settings } = useSettings();
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [currencySymbol, setCurrencySymbol] = useState('৳'); // Default to Bangladeshi Taka (TK)
  
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    images: [] as string[],
    price: 0,
    category_id: null,
    status: 'active',
    content_blocks: [] as ContentBlock[],
    sections: [] as PostSection[],
    specifications: [] as {name: string, value: string}[]
  });
  
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [editingVariation, setEditingVariation] = useState<ProductVariation | null>(null);
  const [productVariations, setProductVariations] = useState<ProductVariation[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  const [variationForm, setVariationForm] = useState({
    product_id: '',
    sku: '',
    options: {
      color: '',
      size: '',
      material: ''
    },
    price: 0,
    stock: 0,
    status: 'active' as 'active' | 'inactive'
  });

  const canEdit = ['admin', 'editor'].includes(user?.role || '');

  useEffect(() => {
    // Add demo products if none exist
    if (products.length === 0 && !loading && categories.length > 0) {
      addDemoProducts();
    }
    
    // Load currency symbol from settings if available
    if (settings && settings.currency_symbol) {
      setCurrencySymbol(settings.currency_symbol);
    }
  }, [products, loading, categories, settings]);

  const addDemoProducts = async () => {
    if (!canEdit || categories.length === 0) return;
    
    // Create demo products
    const demoProducts = [
      {
        name: 'Premium Wireless Headphones',
        slug: 'premium-wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
        images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'],
        price: 199.99,
        category_id: categories[0].id,
        status: 'active',
        specifications: [
          {name: 'Battery Life', value: '20 hours'},
          {name: 'Connectivity', value: 'Bluetooth 5.0'},
          {name: 'Noise Cancellation', value: 'Active'}
        ]
      },
      {
        name: 'Ergonomic Office Chair',
        slug: 'ergonomic-office-chair',
        description: 'Comfortable ergonomic office chair with lumbar support and adjustable height.',
        images: ['https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg'],
        price: 249.99,
        category_id: categories[0].id,
        status: 'active',
        specifications: [
          {name: 'Material', value: 'Mesh and Metal'},
          {name: 'Weight Capacity', value: '300 lbs'},
          {name: 'Adjustable', value: 'Yes'}
        ]
      }
    ];
    
    for (const product of demoProducts) {
      await createProduct(product);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      slug: '',
      description: '',
      images: [],
      price: 0,
      category_id: categories.length > 0 ? categories[0].id : null,
      status: 'active',
      content_blocks: [],
      sections: [],
      specifications: []
    });
    setActiveTab('basic');
    setShowProductModal(true);
  };

  const handleEditProduct = async (product: Product) => {
    setEditingProduct(product);
    
    // Fetch product variations
    const result = await getProductVariations(product.id);
    if (result.success) {
      setProductVariations(result.data || []);
    }
    
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      images: product.images || [],
      price: product.price,
      category_id: product.category_id || undefined,
      status: product.status,
      content_blocks: (product.content_blocks || []) as ContentBlock[],
      sections: (product.sections || []) as PostSection[],
      specifications: product.specifications || []
    });
    setActiveTab('basic');
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    // Generate slug if empty
    let slug = productForm.slug;
    if (!slug) {
      slug = productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    const productData = {
      ...productForm,
      slug
    };
    
    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, productData);
    } else {
      result = await createProduct(productData);
    }
    
    if (result.success) {
      setShowProductModal(false);
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
      setProductForm({
        ...productForm,
        images: [...productForm.images, url]
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductForm({
      ...productForm,
      images: productForm.images.filter((_, i) => i !== index)
    });
  };

  const handleAddSpecification = () => {
    setProductForm({
      ...productForm,
      specifications: [...productForm.specifications, {name: '', value: ''}]
    });
  };

  const handleUpdateSpecification = (index: number, field: 'name' | 'value', value: string) => {
    const newSpecs = [...productForm.specifications];
    newSpecs[index][field] = value;
    setProductForm({
      ...productForm,
      specifications: newSpecs
    });
  };

  const handleRemoveSpecification = (index: number) => {
    setProductForm({
      ...productForm,
      specifications: productForm.specifications.filter((_, i) => i !== index)
    });
  };

  // Variation management
  const handleManageVariations = async (productId: string) => {
    setSelectedProductId(productId);
    
    // Fetch product variations
    const result = await getProductVariations(productId);
    if (result.success) {
      setProductVariations(result.data || []);
    }
    
    // Reset form
    setEditingVariation(null);
    setVariationForm({
      product_id: productId,
      sku: '',
      options: {
        color: '',
        size: '',
        material: ''
      },
      price: 0,
      stock: 0,
      status: 'active'
    });
  };

  const handleCreateVariation = () => {
    if (!selectedProductId) return;
    
    setEditingVariation(null);
    setVariationForm({
      product_id: selectedProductId,
      sku: '',
      options: {
        color: '',
        size: '',
        material: ''
      },
      price: 0,
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
      options: variation.options || {
        color: '',
        size: '',
        material: ''
      },
      price: variation.price,
      stock: variation.stock,
      status: variation.status
    });
    setShowVariationModal(true);
  };

  const handleSaveVariation = async () => {
    let result;
    if (editingVariation) {
      result = await updateProductVariation(editingVariation.id, variationForm);
    } else {
      result = await createProductVariation(variationForm);
    }
    
    if (result.success) {
      setShowVariationModal(false);
      
      // Refresh variations
      if (selectedProductId) {
        const refreshResult = await getProductVariations(selectedProductId);
        if (refreshResult.success) {
          setProductVariations(refreshResult.data || []);
        }
      }
    } else {
      alert(result.error || 'Failed to save variation');
    }
  };

  const handleDeleteVariation = async (variationId: string) => {
    if (!confirm('Are you sure you want to delete this variation?')) return;
    
    const result = await deleteProductVariation(variationId);
    if (result.success) {
      // Refresh variations
      if (selectedProductId) {
        const refreshResult = await getProductVariations(selectedProductId);
        if (refreshResult.success) {
          setProductVariations(refreshResult.data || []);
        }
      }
    } else {
      alert(result.error || 'Failed to delete variation');
    }
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
                  <span>{currencySymbol}{product.price.toFixed(2)}</span>
                </div>
                {product.average_rating && product.average_rating > 0 && (
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm">{product.average_rating?.toFixed(1)}</span>
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
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                  <button 
                    onClick={() => handleManageVariations(product.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Manage Variations
                  </button>
                  <div className="flex items-center space-x-2">
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
      {showProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowProductModal(false)} />
            
            <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl modal-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingProduct ? 'Edit Product' : 'New Product'}
                </h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'basic' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'images' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Images
                </button>
                <button
                  onClick={() => setActiveTab('specifications')}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'specifications' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'content' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Content Blocks
                </button>
                <button
                  onClick={() => setActiveTab('sections')}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'sections' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Sections
                </button>
              </div>

              <div className="space-y-6">
                {activeTab === 'basic' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
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
                        value={productForm.slug}
                        onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="auto-generated-if-empty"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
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
                        value={productForm.category_id}
                        onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">Select Category</option>
                        {categories.filter(cat => cat.category_type === 'product').map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={productForm.status}
                        onChange={(e) => setProductForm({ ...productForm, status: e.target.value as 'active' | 'inactive' })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'images' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Product Images</h4>
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Image</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {productForm.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      
                      {productForm.images.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                          <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">No images added yet</p>
                          <button
                            type="button"
                            onClick={handleAddImage}
                            className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            + Add Product Image
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Product Specifications</h4>
                      <button
                        type="button"
                        onClick={handleAddSpecification}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Specification</span>
                      </button>
                    </div>
                    
                    {productForm.specifications.length > 0 ? (
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {productForm.specifications.map((spec, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="text"
                                    value={spec.name}
                                    onChange={(e) => handleUpdateSpecification(index, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="Specification name"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="text"
                                    value={spec.value}
                                    onChange={(e) => handleUpdateSpecification(index, 'value', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="Specification value"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSpecification(index)}
                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <Tag className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No specifications added yet</p>
                        <button
                          type="button"
                          onClick={handleAddSpecification}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          + Add Specification
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Content Blocks</h4>
                    <ContentBlockEditor
                      blocks={productForm.content_blocks}
                      onChange={(blocks) => setProductForm({ ...productForm, content_blocks: blocks })}
                      onMediaSelect={() => {}}
                    />
                  </div>
                )}

                {activeTab === 'sections' && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Sections</h4>
                    <PostSectionEditor
                      sections={productForm.sections}
                      onChange={(sections) => setProductForm({ ...productForm, sections: sections })}
                      onMediaSelect={() => {}}
                    />
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProduct}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Variations Modal */}
      {selectedProductId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setSelectedProductId(null)} />
            
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl modal-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Product Variations
                </h3>
                <button
                  onClick={() => setSelectedProductId(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {productVariations.length} variations found
                </p>
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
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Options</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {productVariations.map((variation) => (
                        <tr key={variation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {variation.sku}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {Object.entries(variation.options || {}).map(([key, value]) => (
                              <span key={key} className="inline-block px-2 py-1 mr-2 mb-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                {key}: {String(value)}
                              </span>
                            ))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {currencySymbol}{variation.price.toFixed(2)}
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
                            <button
                              onClick={() => handleEditVariation(variation)}
                              className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-3"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteVariation(variation.id)}
                              className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No variations found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add variations to offer different options</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Variation Edit Modal */}
      {showVariationModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowVariationModal(false)} />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl modal-container">
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={variationForm.sku}
                    onChange={(e) => setVariationForm({ ...variationForm, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="PROD-VAR-001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Options
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Color</label>
                      <input
                        type="text"
                        value={variationForm.options.color}
                        onChange={(e) => setVariationForm({ 
                          ...variationForm, 
                          options: { ...variationForm.options, color: e.target.value } 
                        })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Red, Blue, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Size</label>
                      <input
                        type="text"
                        value={variationForm.options.size}
                        onChange={(e) => setVariationForm({ 
                          ...variationForm, 
                          options: { ...variationForm.options, size: e.target.value } 
                        })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="S, M, L, XL, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Material</label>
                      <input
                        type="text"
                        value={variationForm.options.material}
                        onChange={(e) => setVariationForm({ 
                          ...variationForm, 
                          options: { ...variationForm.options, material: e.target.value } 
                        })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Cotton, Leather, etc."
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                        {currencySymbol}
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
                    onChange={(e) => setVariationForm({ ...variationForm, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
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
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingVariation ? 'Update Variation' : 'Create Variation'}</span>
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