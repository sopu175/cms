import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronUp,
  Settings,
  Eye,
  Save,
  X
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '../types';

// Form field types
const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'password', label: 'Password' },
  { value: 'number', label: 'Number' },
  { value: 'tel', label: 'Telephone' },
  { value: 'url', label: 'URL' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Select Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
  { value: 'file', label: 'File Upload' }
];

interface SortableFieldProps {
  field: FormField;
  index: number;
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
}

const SortableField: React.FC<SortableFieldProps> = ({ field, index, onRemove, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-2"
    >
      <div {...attributes} {...listeners} className="cursor-move mr-3">
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900 dark:text-white">{field.label || `Untitled ${field.type} field`}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <span className="capitalize">{field.type}</span>
          {field.required && <span className="text-red-500">*Required</span>}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          type="button" 
          onClick={() => onEdit(index)}
          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"
        >
          <Settings className="w-4 h-4" />
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
  );
};

const FormBuilder: React.FC = () => {
  const [formName, setFormName] = useState('New Form');
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addField = (type: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: type as any,
      label: `New ${type} field`,
      placeholder: '',
      required: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : [],
      order: formFields.length
    };
    
    setFormFields([...formFields, newField]);
    setEditingField(newField);
    setEditingIndex(formFields.length);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = formFields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    );
    setFormFields(updatedFields);
  };

  const removeField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingField(null);
      setEditingIndex(null);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = formFields.findIndex(field => field.id === active.id);
      const newIndex = formFields.findIndex(field => field.id === over.id);
      
      const newFields = [...formFields];
      const [movedField] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, movedField);
      
      // Update order values
      newFields.forEach((field, index) => {
        field.order = index;
      });
      
      setFormFields(newFields);
    }
  };

  const handleEditField = (index: number) => {
    setEditingField({...formFields[index]});
    setEditingIndex(index);
  };

  const handleSaveField = () => {
    if (editingField && editingIndex !== null) {
      updateField(editingIndex, editingField);
      setEditingField(null);
      setEditingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Form Builder</h2>
          <p className="text-gray-600 dark:text-gray-400">Create and manage custom forms for your site</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save Form</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Form Fields */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Form Fields</h3>
            
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={formFields.map(field => field.id)}
                strategy={verticalListSortingStrategy}
              >
                {formFields.map((field, index) => (
                  <SortableField
                    key={field.id}
                    field={field}
                    index={index}
                    onRemove={removeField}
                    onEdit={handleEditField}
                  />
                ))}
              </SortableContext>
            </DndContext>
            
            {formFields.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">No fields added yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add fields using the panel on the right</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Form Details */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Form Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Form Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Contact Form"
                />
              </div>
            </div>
          </div>

          {/* Add Field */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Field</h3>
            
            <div className="grid grid-cols-2 gap-2">
              {FIELD_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => addField(type.value)}
                  className="flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Field Editor Modal */}
      {editingField && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => {
              setEditingField(null);
              setEditingIndex(null);
            }} />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl modal-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Field</h3>
                <button
                  onClick={() => {
                    setEditingField(null);
                    setEditingIndex(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Field Type
                  </label>
                  <select
                    value={editingField.type}
                    onChange={(e) => setEditingField({...editingField, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {FIELD_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Label
                  </label>
                  <input
                    type="text"
                    value={editingField.label}
                    onChange={(e) => setEditingField({...editingField, label: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Field Label"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={editingField.placeholder || ''}
                    onChange={(e) => setEditingField({...editingField, placeholder: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Field Placeholder"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="field-required"
                    checked={editingField.required}
                    onChange={(e) => setEditingField({...editingField, required: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="field-required"
                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Required field
                  </label>
                </div>

                {['select', 'radio', 'checkbox'].includes(editingField.type) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Options (one per line)
                    </label>
                    <textarea
                      value={(editingField.options || []).join('\n')}
                      onChange={(e) => {
                        const options = e.target.value.split('\n').filter(line => line.trim() !== '');
                        setEditingField({...editingField, options});
                      }}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingField(null);
                    setEditingIndex(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveField}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Field
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowPreview(false)} />
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl modal-container">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Form Preview: {formName}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <form className="space-y-6">
                  {formFields.sort((a, b) => a.order - b.order).map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      
                      {field.type === 'text' && (
                        <input 
                          type="text" 
                          placeholder={field.placeholder} 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          required={field.required}
                        />
                      )}
                      
                      {field.type === 'email' && (
                        <input 
                          type="email" 
                          placeholder={field.placeholder} 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          required={field.required}
                        />
                      )}
                      
                      {field.type === 'textarea' && (
                        <textarea 
                          placeholder={field.placeholder} 
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          required={field.required}
                        />
                      )}
                      
                      {field.type === 'select' && (
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          required={field.required}
                        >
                          <option value="">Select an option</option>
                          {field.options?.map((option, i) => (
                            <option key={i} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      
                      {field.type === 'checkbox' && (
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            required={field.required}
                          />
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {field.placeholder || 'Check this box'}
                          </span>
                        </div>
                      )}
                      
                      {field.type === 'radio' && field.options?.map((option, i) => (
                        <div key={i} className="flex items-center">
                          <input 
                            type="radio" 
                            name={`radio-${field.id}`}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            required={field.required}
                          />
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {option}
                          </span>
                        </div>
                      ))}
                      
                      {(field.type === 'date' || field.type === 'time' || field.type === 'number') && (
                        <input 
                          type={field.type} 
                          placeholder={field.placeholder} 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;