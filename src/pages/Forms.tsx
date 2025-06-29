import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FileInput,
  X,
  Save,
  Grip,
  ArrowDown,
  ArrowUp,
  Settings,
  Copy
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

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

// Initial form field
const initialField = {
  id: '',
  type: 'text',
  label: '',
  placeholder: '',
  required: false,
  options: [],
  validation: null,
  order: 0
};

// Form validation schema
const FormSchema = Yup.object().shape({
  name: Yup.string().required('Form name is required'),
  slug: Yup.string().required('Form slug is required'),
  fields: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required('Field label is required'),
      type: Yup.string().required('Field type is required')
    })
  )
});

// Sortable field component
const SortableField = ({ field, index, onRemove, onEdit }) => {
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
        <Grip className="w-5 h-5 text-gray-400" />
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
  );
};

const Forms: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [forms, setForms] = useState([
    { 
      id: '1', 
      name: 'Contact Form', 
      slug: 'contact', 
      description: 'General contact form for inquiries',
      fields: [
        { id: '1', type: 'text', label: 'Full Name', placeholder: 'Enter your full name', required: true, order: 0 },
        { id: '2', type: 'email', label: 'Email Address', placeholder: 'Enter your email', required: true, order: 1 },
        { id: '3', type: 'textarea', label: 'Message', placeholder: 'Your message here...', required: true, order: 2 }
      ],
      submissions: 12,
      status: 'active',
      created_at: '2023-06-15T10:30:00Z'
    },
    { 
      id: '2', 
      name: 'Newsletter Signup', 
      slug: 'newsletter', 
      description: 'Subscribe to our newsletter',
      fields: [
        { id: '1', type: 'text', label: 'Name', placeholder: 'Your name', required: false, order: 0 },
        { id: '2', type: 'email', label: 'Email', placeholder: 'Your email address', required: true, order: 1 }
      ],
      submissions: 48,
      status: 'active',
      created_at: '2023-07-20T14:15:00Z'
    }
  ]);
  
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const canEdit = ['admin', 'editor', 'author'].includes(user?.role || '');

  const handleCreateForm = () => {
    setEditingForm({
      name: '',
      slug: '',
      description: '',
      fields: [],
      status: 'active',
      settings: {
        submit_text: 'Submit',
        success_message: 'Thank you for your submission!',
        redirect_url: '',
        email_notifications: false,
        notification_email: ''
      }
    });
    setShowFormBuilder(true);
  };

  const handleEditForm = (form) => {
    setEditingForm(form);
    setShowFormBuilder(true);
  };

  const handleDeleteForm = (formId) => {
    if (confirm('Are you sure you want to delete this form?')) {
      setForms(forms.filter(form => form.id !== formId));
    }
  };

  const handleDragEnd = (event, formikProps) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = formikProps.values.fields.findIndex(field => field.id === active.id);
      const newIndex = formikProps.values.fields.findIndex(field => field.id === over.id);
      
      const newFields = [...formikProps.values.fields];
      const [movedField] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, movedField);
      
      // Update order values
      newFields.forEach((field, index) => {
        field.order = index;
      });
      
      formikProps.setFieldValue('fields', newFields);
    }
  };

  const handleSaveForm = (values) => {
    if (editingForm.id) {
      // Update existing form
      setForms(forms.map(form => 
        form.id === editingForm.id ? { ...form, ...values } : form
      ));
    } else {
      // Create new form
      setForms([...forms, { 
        ...values, 
        id: Date.now().toString(),
        submissions: 0,
        created_at: new Date().toISOString()
      }]);
    }
    setShowFormBuilder(false);
    setEditingForm(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredForms = forms.filter(form => 
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showFormBuilder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {editingForm.id ? 'Edit Form' : 'Create Form'}
          </h2>
          <button
            onClick={() => setShowFormBuilder(false)}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>
        </div>

        <Formik
          initialValues={editingForm}
          validationSchema={FormSchema}
          onSubmit={handleSaveForm}
        >
          {formikProps => (
            <Form className="space-y-8">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Form Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Form Name
                    </label>
                    <Field
                      name="name"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Contact Form"
                    />
                    {formikProps.errors.name && formikProps.touched.name && (
                      <div className="text-red-500 text-sm mt-1">{formikProps.errors.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Form Slug
                    </label>
                    <Field
                      name="slug"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="contact"
                    />
                    {formikProps.errors.slug && formikProps.touched.slug && (
                      <div className="text-red-500 text-sm mt-1">{formikProps.errors.slug}</div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Describe the purpose of this form"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Field>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Form Fields</h3>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        formikProps.setFieldValue('fields', [
                          ...formikProps.values.fields,
                          {
                            ...initialField,
                            id: Date.now().toString(),
                            order: formikProps.values.fields.length
                          }
                        ]);
                        setEditingFieldIndex(formikProps.values.fields.length);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Field</span>
                    </button>
                  </div>
                </div>

                <FieldArray name="fields">
                  {({ remove, push, move }) => (
                    <div>
                      {formikProps.values.fields.length > 0 ? (
                        <DndContext 
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(event) => handleDragEnd(event, formikProps)}
                        >
                          <SortableContext
                            items={formikProps.values.fields.map(field => field.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {formikProps.values.fields.map((field, index) => (
                              <SortableField
                                key={field.id}
                                field={field}
                                index={index}
                                onRemove={remove}
                                onEdit={() => setEditingFieldIndex(index)}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                          <FileInput className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">No fields added yet</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500">Click "Add Field" to start building your form</p>
                        </div>
                      )}
                    </div>
                  )}
                </FieldArray>
              </div>

              {editingFieldIndex !== null && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setEditingFieldIndex(null)} />
                    
                    <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Field</h3>
                        <button
                          type="button"
                          onClick={() => setEditingFieldIndex(null)}
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
                          <Field
                            as="select"
                            name={`fields.${editingFieldIndex}.type`}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            {FIELD_TYPES.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </Field>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Label
                          </label>
                          <Field
                            name={`fields.${editingFieldIndex}.label`}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Field Label"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Placeholder
                          </label>
                          <Field
                            name={`fields.${editingFieldIndex}.placeholder`}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Field Placeholder"
                          />
                        </div>

                        <div className="flex items-center">
                          <Field
                            type="checkbox"
                            name={`fields.${editingFieldIndex}.required`}
                            id={`field-required-${editingFieldIndex}`}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`field-required-${editingFieldIndex}`}
                            className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Required field
                          </label>
                        </div>

                        {['select', 'radio', 'checkbox'].includes(formikProps.values.fields[editingFieldIndex]?.type) && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Options (one per line)
                            </label>
                            <Field
                              as="textarea"
                              name={`fields.${editingFieldIndex}.options`}
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
                          onClick={() => setEditingFieldIndex(null)}
                          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingFieldIndex(null)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Save Field
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Form Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Submit Button Text
                    </label>
                    <Field
                      name="settings.submit_text"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Submit"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Redirect URL (optional)
                    </label>
                    <Field
                      name="settings.redirect_url"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://example.com/thank-you"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Success Message
                  </label>
                  <Field
                    as="textarea"
                    name="settings.success_message"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Thank you for your submission!"
                  />
                </div>

                <div className="mt-4 flex items-center">
                  <Field
                    type="checkbox"
                    name="settings.email_notifications"
                    id="email_notifications"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="email_notifications"
                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Send email notifications
                  </label>
                </div>

                {formikProps.values.settings?.email_notifications && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notification Email
                    </label>
                    <Field
                      name="settings.notification_email"
                      type="email"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="admin@example.com"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFormBuilder(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingForm.id ? 'Update Form' : 'Create Form'}</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Forms</h2>
          <p className="text-gray-600 dark:text-gray-400">Create and manage custom forms</p>
        </div>
        {canEdit && (
          <button
            onClick={handleCreateForm}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Form</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search forms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <div
            key={form.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{form.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">/{form.slug}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full capitalize ${form.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400'}`}>
                {form.status}
              </span>
            </div>

            {form.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{form.description}</p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>{form.fields.length} fields</span>
              <span>{form.submissions} submissions</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Created {formatDate(form.created_at)}
              </span>
              
              {canEdit && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditForm(form)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteForm(form.id)}
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

      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileInput className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No forms found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first form to get started'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Forms;