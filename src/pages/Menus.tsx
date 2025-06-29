import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Navigation,
  X,
  Save,
  Link,
  ExternalLink,
  Grip,
  ChevronDown,
  ChevronUp,
  Settings,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Menu, MenuItem } from '../types';

// Menu item types
const MENU_ITEM_TYPES = [
  { value: 'page', label: 'Page' },
  { value: 'post', label: 'Post' },
  { value: 'category', label: 'Category' },
  { value: 'product', label: 'Product' },
  { value: 'custom', label: 'Custom Link' }
];

// Menu locations
const MENU_LOCATIONS = [
  { value: 'header', label: 'Header' },
  { value: 'footer', label: 'Footer' },
  { value: 'sidebar', label: 'Sidebar' },
  { value: 'mobile', label: 'Mobile Menu' }
];

interface SortableMenuItemProps {
  item: MenuItem;
  index: number | string;
  depth?: number;
  onRemove: (index: number | string) => void;
  onEdit: (index: number | string) => void;
  onAddChild?: (parentIndex: number | string) => void;
}

// Sortable menu item component
const SortableMenuItem: React.FC<SortableMenuItemProps> = ({ 
  item, 
  index, 
  depth = 0, 
  onRemove, 
  onEdit,
  onAddChild 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const [expanded, setExpanded] = useState(false);
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${depth * 24}px`
  };
  
  return (
    <>
      <div 
        ref={setNodeRef} 
        style={style} 
        className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-2"
      >
        <div {...attributes} {...listeners} className="cursor-move mr-3">
          <Grip className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
            <span className="capitalize">{item.type}</span>
            <span>•</span>
            <span className="truncate max-w-[150px]">{item.url}</span>
            {item.target === '_blank' && <ExternalLink className="w-3 h-3" />}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {item.children && item.children.length > 0 && (
            <button 
              type="button" 
              onClick={() => setExpanded(!expanded)}
              className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button 
            type="button"
            onClick={() => onAddChild && onAddChild(index)}
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg"
            title="Add Child Item"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            onClick={() => onEdit(index)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            onClick={() => onRemove(index)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {expanded && item.children && item.children.length > 0 && (
        <div className="ml-6">
          {item.children.map((child, childIndex) => (
            <SortableMenuItem
              key={child.id}
              item={child}
              index={`${index}-${childIndex}`}
              onRemove={(idx) => {
                const newChildren = [...item.children];
                if (typeof idx === 'number') {
                  newChildren.splice(idx, 1);
                } else {
                  const childIdx = parseInt(idx.toString().split('-').pop() || '0');
                  newChildren.splice(childIdx, 1);
                }
                // Handle child removal logic here
              }}
              onEdit={(idx) => {
                // Handle child edit logic here
                if (typeof idx === 'string') {
                  const childIdx = parseInt(idx.toString().split('-').pop() || '0');
                  onEdit(`${index}-${childIdx}`);
                }
              }}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </>
  );
};

const Menus: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [menus, setMenus] = useState<Menu[]>([
    { 
      id: '1', 
      name: 'Main Navigation', 
      slug: 'main-nav', 
      location: 'header',
      items: [
        { id: '1', label: 'Home', url: '/', type: 'page', target: '_self' },
        { id: '2', label: 'About', url: '/about', type: 'page', target: '_self' },
        { id: '3', label: 'Products', url: '/products', type: 'page', target: '_self', children: [
          { id: '3-1', label: 'New Arrivals', url: '/products/new', type: 'custom', target: '_self' },
          { id: '3-2', label: 'Best Sellers', url: '/products/best', type: 'custom', target: '_self' }
        ]},
        { id: '4', label: 'Contact', url: '/contact', type: 'page', target: '_self' }
      ],
      status: 'active',
      created_at: '2023-06-15T10:30:00Z'
    },
    { 
      id: '2', 
      name: 'Footer Menu', 
      slug: 'footer-menu', 
      location: 'footer',
      items: [
        { id: '1', label: 'Privacy Policy', url: '/privacy', type: 'page', target: '_self' },
        { id: '2', label: 'Terms of Service', url: '/terms', type: 'page', target: '_self' },
        { id: '3', label: 'Blog', url: '/blog', type: 'page', target: '_self' }
      ],
      status: 'active',
      created_at: '2023-07-20T14:15:00Z'
    }
  ]);
  
  const [showMenuBuilder, setShowMenuBuilder] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [parentPath, setParentPath] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const canEdit = ['admin', 'editor'].includes(user?.role || '');

  const handleCreateMenu = () => {
    setEditingMenu({
      id: '',
      name: '',
      slug: '',
      location: 'header',
      items: [],
      status: 'active',
      created_at: new Date().toISOString()
    });
    setMenuItems([]);
    setShowMenuBuilder(true);
  };

  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);
    setMenuItems(menu.items || []);
    setShowMenuBuilder(true);
  };

  const handleDeleteMenu = (menuId: string) => {
    if (confirm('Are you sure you want to delete this menu?')) {
      setMenus(menus.filter(menu => menu.id !== menuId));
    }
  };

  const handleAddMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      label: 'New Item',
      url: '/',
      type: 'custom',
      target: '_self'
    };
    
    if (parentPath) {
      // Add as child to specified parent
      const indices = parentPath.split('-').map(Number);
      const newItems = [...menuItems];
      
      let currentItems = newItems;
      let currentItem;
      
      // Navigate to the parent item
      for (let i = 0; i < indices.length; i++) {
        const idx = indices[i];
        currentItem = currentItems[idx];
        
        if (i === indices.length - 1) {
          // We've reached the parent item
          if (!currentItem.children) {
            currentItem.children = [];
          }
          currentItem.children.push(newItem);
        } else {
          // We need to go deeper
          if (!currentItem.children) {
            currentItem.children = [];
          }
          currentItems = currentItem.children;
        }
      }
      
      setMenuItems(newItems);
      setEditingMenuItem({...newItem, parentPath});
    } else {
      // Add to root level
      setMenuItems([...menuItems, newItem]);
      setEditingMenuItem(newItem);
    }
    
    setParentPath(null);
  };

  const handleAddChildItem = (parentIndex: number | string) => {
    setParentPath(parentIndex.toString());
    handleAddMenuItem();
  };

  const findItemByPath = (path: string, items: MenuItem[]): MenuItem | null => {
    const indices = path.split('-').map(Number);
    let currentItems = items;
    let currentItem = null;
    
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      currentItem = currentItems[idx];
      
      if (i === indices.length - 1) {
        return currentItem;
      } else {
        if (!currentItem.children) {
          return null;
        }
        currentItems = currentItem.children;
      }
    }
    
    return null;
  };

  const updateItemByPath = (path: string, updatedItem: MenuItem, items: MenuItem[]): MenuItem[] => {
    const indices = path.split('-').map(Number);
    const result = [...items];
    
    if (indices.length === 1) {
      // Simple case: top-level item
      result[indices[0]] = {
        ...updatedItem,
        children: result[indices[0]].children // Preserve children
      };
      return result;
    }
    
    // Complex case: nested item
    let currentItems = result;
    let currentItem;
    
    for (let i = 0; i < indices.length - 1; i++) {
      const idx = indices[i];
      currentItem = currentItems[idx];
      
      if (!currentItem.children) {
        currentItem.children = [];
      }
      currentItems = currentItem.children;
    }
    
    // Update the target item
    const lastIndex = indices[indices.length - 1];
    const targetItem = currentItems[lastIndex];
    currentItems[lastIndex] = {
      ...updatedItem,
      children: targetItem.children // Preserve children
    };
    
    return result;
  };

  const removeItemByPath = (path: string, items: MenuItem[]): MenuItem[] => {
    const indices = path.split('-').map(Number);
    const result = [...items];
    
    if (indices.length === 1) {
      // Simple case: top-level item
      result.splice(indices[0], 1);
      return result;
    }
    
    // Complex case: nested item
    let currentItems = result;
    let currentItem;
    
    for (let i = 0; i < indices.length - 1; i++) {
      const idx = indices[i];
      currentItem = currentItems[idx];
      
      if (!currentItem.children) {
        return result; // Item not found
      }
      currentItems = currentItem.children;
    }
    
    // Remove the target item
    const lastIndex = indices[indices.length - 1];
    currentItems.splice(lastIndex, 1);
    
    return result;
  };

  const handleEditMenuItem = (index: number | string) => {
    const path = index.toString();
    const item = typeof index === 'number' 
      ? menuItems[index] 
      : findItemByPath(path, menuItems);
    
    if (item) {
      setEditingMenuItem({
        ...item,
        path
      });
    }
  };

  const handleRemoveMenuItem = (index: number | string) => {
    const path = index.toString();
    setMenuItems(removeItemByPath(path, menuItems));
  };

  const handleSaveMenuItem = (item: any) => {
    const { path, ...itemData } = item;
    
    if (path) {
      setMenuItems(updateItemByPath(path, itemData, menuItems));
    } else {
      const newItems = [...menuItems];
      const idx = typeof item.index === 'number' ? item.index : newItems.length;
      
      if (idx < newItems.length) {
        newItems[idx] = {
          id: item.id,
          label: item.label,
          url: item.url,
          type: item.type,
          target: item.target,
          children: newItems[idx].children
        };
      } else {
        newItems.push({
          id: item.id,
          label: item.label,
          url: item.url,
          type: item.type,
          target: item.target
        });
      }
      
      setMenuItems(newItems);
    }
    
    setEditingMenuItem(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = menuItems.findIndex(item => item.id === active.id);
      const newIndex = menuItems.findIndex(item => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = [...menuItems];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
        
        setMenuItems(newItems);
      }
    }
  };

  const handleSaveMenu = () => {
    const menuData = {
      ...editingMenu,
      items: menuItems,
      slug: editingMenu?.slug || editingMenu?.name?.toLowerCase().replace(/\s+/g, '-') || ''
    };
    
    if (editingMenu?.id) {
      // Update existing menu
      setMenus(menus.map(menu => 
        menu.id === editingMenu.id ? menuData : menu
      ));
    } else {
      // Create new menu
      setMenus([...menus, { 
        ...menuData, 
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      }]);
    }
    setShowMenuBuilder(false);
    setEditingMenu(null);
    setMenuItems([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredMenus = menus.filter(menu => 
    menu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showMenuBuilder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {editingMenu?.id ? 'Edit Menu' : 'Create Menu'}
          </h2>
          <button
            onClick={() => setShowMenuBuilder(false)}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Menu Items</h3>
              
              {menuItems.length > 0 ? (
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={menuItems.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {menuItems.map((item, index) => (
                      <SortableMenuItem
                        key={item.id}
                        item={item}
                        index={index}
                        onRemove={handleRemoveMenuItem}
                        onEdit={handleEditMenuItem}
                        onAddChild={handleAddChildItem}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No menu items added yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Click "Add Menu Item" to start building your menu</p>
                </div>
              )}
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddMenuItem}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Menu Item</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Menu Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Menu Name
                  </label>
                  <input
                    type="text"
                    value={editingMenu?.name || ''}
                    onChange={(e) => setEditingMenu(prev => prev ? {...prev, name: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Main Navigation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Menu Slug
                  </label>
                  <input
                    type="text"
                    value={editingMenu?.slug || ''}
                    onChange={(e) => setEditingMenu(prev => prev ? {...prev, slug: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="main-nav"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <select
                    value={editingMenu?.location || ''}
                    onChange={(e) => setEditingMenu(prev => prev ? {...prev, location: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {MENU_LOCATIONS.map(location => (
                      <option key={location.value} value={location.value}>{location.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editingMenu?.status || ''}
                    onChange={(e) => setEditingMenu(prev => prev ? {...prev, status: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Menu Preview</h3>
              
              {menuItems.length > 0 ? (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <li key={item.id} className="text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <ArrowRight className="w-3 h-3 mr-1 text-gray-400" />
                          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                            {item.label}
                          </a>
                          {item.target === '_blank' && <ExternalLink className="w-3 h-3 ml-1 text-gray-400" />}
                        </div>
                        {item.children && item.children.length > 0 && (
                          <ul className="ml-4 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <li key={child.id} className="text-gray-600 dark:text-gray-400 text-sm">
                                <div className="flex items-center">
                                  <ChevronRight className="w-3 h-3 mr-1 text-gray-400" />
                                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                                    {child.label}
                                  </a>
                                  {child.target === '_blank' && <ExternalLink className="w-3 h-3 ml-1 text-gray-400" />}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  Add menu items to see a preview
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveMenu}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Save className="w-4 h-4" />
              <span>{editingMenu?.id ? 'Update Menu' : 'Create Menu'}</span>
            </button>
          </div>
        </div>

        {/* Menu Item Editor Modal */}
        {editingMenuItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setEditingMenuItem(null)} />
              
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Menu Item</h3>
                  <button
                    type="button"
                    onClick={() => setEditingMenuItem(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Label
                    </label>
                    <input
                      type="text"
                      value={editingMenuItem.label}
                      onChange={(e) => setEditingMenuItem({...editingMenuItem, label: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Menu Item Label"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={editingMenuItem.type}
                      onChange={(e) => setEditingMenuItem({...editingMenuItem, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {MENU_ITEM_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL
                    </label>
                    <input
                      type="text"
                      value={editingMenuItem.url}
                      onChange={(e) => setEditingMenuItem({...editingMenuItem, url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="/page-url"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Open in
                    </label>
                    <select
                      value={editingMenuItem.target}
                      onChange={(e) => setEditingMenuItem({...editingMenuItem, target: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="_self">Same Window</option>
                      <option value="_blank">New Window</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingMenuItem(null)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveMenuItem(editingMenuItem)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Menus</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage navigation menus for your site</p>
        </div>
        {canEdit && (
          <button
            onClick={handleCreateMenu}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Menu</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search menus..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Menus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenus.map((menu) => (
          <div
            key={menu.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{menu.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="capitalize">{menu.location}</span>
                  <span>•</span>
                  <span>{menu.slug}</span>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full capitalize ${menu.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400'}`}>
                {menu.status}
              </span>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4 bg-gray-50 dark:bg-gray-800/50">
              <ul className="space-y-1">
                {menu.items.slice(0, 3).map((item) => (
                  <li key={item.id} className="text-gray-700 dark:text-gray-300 text-sm">
                    {item.label}
                    {item.children && item.children.length > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        (+{item.children.length})
                      </span>
                    )}
                  </li>
                ))}
                {menu.items.length > 3 && (
                  <li className="text-gray-500 dark:text-gray-400 text-xs">
                    +{menu.items.length - 3} more items
                  </li>
                )}
              </ul>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Created {formatDate(menu.created_at)}
              </span>
              
              {canEdit && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditMenu(menu)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMenu(menu.id)}
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

      {filteredMenus.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No menus found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first menu to get started'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Menus;