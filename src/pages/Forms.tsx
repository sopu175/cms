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
  Copy,
  Mail,
  Send,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Formik, Form, Field, FieldArray, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Form as FormType, FormField } from '../types';

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
const initialField: FormField = {
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

interface SortableFieldProps {
  field: FormField;
  index: number;
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
}

// Sortable field component
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
  const [forms, setForms] = useState<FormType[]>([
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
      settings: {
        submit_text: 'Send Message',
        success_message: 'Thank you for your message! We will get back to you soon.',
        email_notifications: true,
        notification_email: 'admin@example.com',
        sender_email: 'no-reply@example.com',
        email_subject: 'New Contact Form Submission',
        redirect_url: ''
      },
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
      settings: {
        submit_text: 'Subscribe',
        success_message: 'Thank you for subscribing to our newsletter!',
        email_notifications: true,
        notification_email: 'marketing@example.com',
        sender_email: 'newsletter@example.com',
        email_subject: 'New Newsletter Subscription',
        redirect_url: '/thank-you'
      },
      status: 'active',
      created_at: '2023-07-20T14:15:00Z'
    }
  ]);
  
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [editingForm, setEditingForm] = useState<FormType | null>(null);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [showFormPreview, setShowFormPreview] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const canEdit = ['admin', 'editor', 'author'].includes(user?.role || '');

  const handleCreateForm = () => {
    setEditingForm({
      id: '',
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
        notification_email: '',
        sender_email: 'no-reply@example.com',
        email_subject: 'New Form Submission'
      },
      created_at: new Date().toISOString()
    });
    setShowFormBuilder(true);
  };

  const handleEditForm = (form: FormType) => {
    setEditingForm(form);
    setShowFormBuilder(true);
  };

  const handleDeleteForm = (formId: string) => {
    if (confirm('Are you sure you want to delete this form?')) {
      setForms(forms.filter(form => form.id !== formId));
    }
  };

  const handleDragEnd = (event: DragEndEvent, formikProps: FormikProps<any>) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = formikProps.values.fields.findIndex((field: FormField) => field.id === active.id);
      const newIndex = formikProps.values.fields.findIndex((field: FormField) => field.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newFields = [...formikProps.values.fields];
        const [movedField] = newFields.splice(oldIndex, 1);
        newFields.splice(newIndex, 0, movedField);
        
        // Update order values
        newFields.forEach((field, index) => {
          field.order = index;
        });
        
        formikProps.setFieldValue('fields', newFields);
      }
    }
  };

  const handleSaveForm = (values: any) => {
    if (editingForm?.id) {
      // Update existing form
      setForms(forms.map(form => 
        form.id === editingForm.id ? { ...form, ...values } : form
      ));
    } else {
      // Create new form
      setForms([...forms, { 
        ...values, 
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      }]);
    }
    setShowFormBuilder(false);
    setEditingForm(null);
  };

  const formatDate = (dateString: string) => {
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

  const renderFormPreview = () => {
    if (!editingForm) return null;
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowFormPreview(false)} />
          
          <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Form Preview: {editingForm.name}</h3>
              <button
                type="button"
                onClick={() => setShowFormPreview(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <form className="space-y-6">
                {editingForm.fields.sort((a, b) => a.order - b.order).map((field) => (
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
                    {editingForm.settings?.submit_text || 'Submit'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Form Submission Process</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                When a user submits this form:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-400 list-disc list-inside">
                <li>Data will be stored in the database</li>
                {editingForm.settings?.email_notifications && (
                  <li>
                    Email notification will be sent to {editingForm.settings.notification_email || 'the admin'}
                  </li>
                )}
                {editingForm.settings?.redirect_url && (
                  <li>
                    User will be redirected to: {editingForm.settings.redirect_url}
                  </li>
                )}
                <li>
                  Success message will be shown: "{editingForm.settings?.success_message || 'Thank you for your submission!'}"
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showFormBuilder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {editingForm?.id ? 'Edit Form' : 'Create Form'}
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFormPreview(true)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              Preview Form
            </button>
            <button
              onClick={() => setShowFormBuilder(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>

        <Formik
          initialValues={editingForm || {
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
              notification_email: '',
              sender_email: 'no-reply@example.com',
              email_subject: 'New Form Submission'
            }
          }}
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
                      <div className="text-red-500 text-sm mt-1">{formikProps.errors.name as string}</div>
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
                      <div className="text-red-500 text-sm mt-1">{formikProps.errors.slug as string}</div>
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
                    
                    <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl modal-container">
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
                            <textarea
                              value={(formikProps.values.fields[editingFieldIndex]?.options || []).join('\n')}
                              onChange={(e) => {
                                const options = e.target.value.split('\n').filter(line => line.trim() !== '');
                                formikProps.setFieldValue(`fields.${editingFieldIndex}.options`, options);
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

                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Notification Settings
                  </h4>
                  
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
                    <div className="mt-4 space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Notification Email (Recipient)
                        </label>
                        <Field
                          name="settings.notification_email"
                          type="email"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="admin@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Sender Email
                        </label>
                        <Field
                          name="settings.sender_email"
                          type="email"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="no-reply@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Subject
                        </label>
                        <Field
                          name="settings.email_subject"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="New Form Submission"
                        />
                      </div>
                      
                      <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                        <Send className="w-4 h-4 mr-2" />
                        <span>Email will include all form field values</span>
                      </div>
                    </div>
                  )}
                </div>
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
                  <span>{editingForm?.id ? 'Update Form' : 'Create Form'}</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
        
        {showFormPreview && renderFormPreview()}
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
              <span>{Math.floor(Math.random() * 100)} submissions</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Created {formatDate(form.created_at)}
              </span>
              
              {canEdit && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingForm(form);
                      setShowFormPreview(true);
                    }}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors"
                    title="Preview Form"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`[form id="${form.id}"]`);
                      alert('Shortcode copied to clipboard!');
                    }}
                    className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors"
                    title="Copy Shortcode"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
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
      
      {showFormPreview && renderFormPreview()}
    </div>
  );
};

export default Forms;