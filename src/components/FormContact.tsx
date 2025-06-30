'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'sonner';
import TextInput from "@/components/ui/field/TextInput";
import SelectInput from "@/components/ui/field/SelectInput";
import Button from "@/components/ui/Button";
import CheckBox from "@/components/ui/field/CheckBox";
import RadioButton from "@/components/ui/field/RadioButton";
import { FieldError } from 'react-hook-form';
import Title from "@/components/ui/Title";
import { getFormData } from '@/utils/api';

interface FormData {
    [key: string]: unknown;
}

interface FormContactProps {
    padding?: string;
    asModal?: boolean;
    id?: string;
    formData?: FormData[];
    form_id?: string;
    career?: boolean;
}

const FormContact: React.FC<FormContactProps> = ({
    padding,
    asModal,
    id,
    formData: initialFormData,
    form_id,
    career,
}) => {
    const { register, handleSubmit, formState, reset, setValue, control } = useForm({ mode: 'all' });
    const { errors } = formState;
    const [selectUploadMessage, setSelectUploadMessage] = useState('Attach CV');
    const cvRef = useRef<HTMLInputElement | null>(null);
    const [cv, setCv] = useState<File | null>(null);
    const [formData, setFormData] = useState<FormData[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Fetch form data if not provided as props
    useEffect(() => {
        const fetchData = async () => {
            if (!initialFormData && form_id) {
                setIsLoading(true);
                try {
                    const data = await getFormData(form_id);
                    if (data) {
                        setFormData(data);
                    }
                } catch (error) {
                    console.error('Error fetching form data:', error);
                    toast.error('Failed to load form data');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setFormData(initialFormData || []);
            }
        };
        
        fetchData();
    }, [initialFormData, form_id]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        setCv(selectedFile || null);

        if (selectedFile) {
            setSelectUploadMessage(selectedFile.name);
        }

        // Reset the file input field to allow re-uploading
        if (cvRef.current) {
            cvRef.current.value = ''; // Reset the file input
        }
    };

    const handleSelectInputChange = useCallback(
        (fieldKey: string, selectedOption: { value: string; label: string } | null) => {
            if (selectedOption) {
                setValue(fieldKey, selectedOption.value);  // Update the react-hook-form value directly
            }
        },
        [setValue]
    );

    const onSubmit = async (data: Record<string, unknown>) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });

            if (cv) {
                formData.append('file', cv);
            }
            formData.append('form_id', form_id || 'contact_form');

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/post-req-data/form-submit`,
                formData
            );

            if (response?.data?.result === 'success') {
                toast.success(response?.data?.message || 'Form submitted successfully');

                // Create default values object for all form fields
                const defaultValues: Record<string, unknown> = {};
                formData?.forEach((field) => {
                    if (typeof field === 'object' && field !== null && 'field_key' in field) {
                        const { field_key } = field as { field_key: string };
                        defaultValues[field_key] = '';
                    }
                });

                reset(defaultValues); // Reset with empty values
                setCv(null); // Reset the file field
                setSelectUploadMessage('Attach CV'); // Reset the upload message
            } else if (response?.data?.result === 'error') {
                toast.error(response?.data?.message || 'An error occurred. Please try again.');
            }
        } catch (err: unknown) {
            const error = err as { message?: string };
            toast.error(error?.message || 'Failed to submit form. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const onError = (errors: Record<string, unknown>) => {
        const count = Object.values(errors).length;
        if (count > 0) {
            toast.error('Please fill out all required fields correctly');
        }
    };

    const convertToOptions = (data: string) => {
        const parsedData = data.split(',').reduce((acc, item) => {
            const [key, value] = item.split(':');
            if (key && value) {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, string>);
        return Object.entries(parsedData).map(([key, value]) => ({
            value: key,
            label: value,
        }));
    };

    if (isLoading) {
        return (
            <section className="bg-[#f5f5f5] pb-[120px] pt-[120px]">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center min-h-[200px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (!formData || formData.length === 0) {
        return (
            <section className="bg-[#f5f5f5] pb-[120px] pt-[120px]">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center p-8 bg-white shadow-md rounded-lg">
                        <Title tag='h2' margin={'0 0 20px'} fontSize="1.5rem" color="#333">
                            Form Not Available
                        </Title>
                        <p className="text-gray-600">
                            The requested form could not be loaded. Please try again later or contact support.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#f5f5f5] pb-[120px] pt-[120px]">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`relative ${asModal ? 'modal' : ''} ${padding || ''}`}
                    id={id || 'FormContact'}
                >
                    <Title tag='h2' margin={'0 0 60px'} fontFamily='var(--var-dc--font-mono)'
                           spanColor='var(--var-dc--error-color)' color='var(--var-dc--foreground)' textAlign='left'>
                        Contact Form
                    </Title>
                    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6 bg-white p-8 shadow-md rounded-lg">
                        <input name="spam_protector" type="hidden"/>
                        <input name="form_id" value={form_id || "contact_form"} type="hidden"/>

                        {formData?.map((field: any, index) => {
                            const {field_key, field_type, placeholder, label, validators, options} = field;
                            const required = validators?.split(',').map((f: string) => f.trim()).includes('required');
                            const error = errors[field_key];

                            return (
                                <div key={index} className="space-y-2">
                                    {field_type === 'textArea' ? (
                                        <TextInput
                                            name={field_key}
                                            as="textarea"
                                            placeholder={placeholder}
                                            register={register}
                                            validation={{required: required ? `${label} is required` : false}}
                                            error={error as FieldError}
                                        />
                                    ) : field_type === 'fileInput' ? (
                                        <div className="relative">
                                            <input
                                                ref={cvRef}
                                                onChange={handleFileUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                id="file-input"
                                                type="file"
                                                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            />
                                            <button
                                                type="button"
                                                className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-none border flex items-center justify-between"
                                            >
                                                <span>{selectUploadMessage}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                                                </svg>
                                            </button>
                                            {required && !cv && error && (
                                                <span className="text-sm text-red-500 mt-1">File is required</span>
                                            )}
                                        </div>
                                    ) : field_type === 'dropDownList' ? (
                                        <Controller
                                            name={field_key}
                                            control={control}
                                            rules={{
                                                required: required ? `${label} is required` : false,
                                            }}
                                            render={({
                                                         field: controllerField,
                                                         fieldState: {error: controllerError}
                                                     }) => (
                                                <div className="space-y-1">
                                                    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
                                                    <SelectInput
                                                        error={controllerError ? {message: controllerError.message || 'This field is required'} : undefined}
                                                        options={options ? convertToOptions(options) : []}
                                                        name={field_key}
                                                        placeholder={placeholder}
                                                        value={controllerField.value ? {
                                                            value: controllerField.value,
                                                            label: convertToOptions(options).find(opt => opt.value === controllerField.value)?.label || controllerField.value
                                                        } : null}
                                                        onChange={(selectedOption) => {
                                                            controllerField.onChange(selectedOption?.value || null);
                                                            handleSelectInputChange(field_key, selectedOption);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        />
                                    ) : field_type === 'checkBox' ? (
                                        <CheckBox
                                            validation={{required: required ? `${label ? label + ' is required' : 'Check the terms and Conditions before Submit'}` : false}}
                                            error={error as FieldError} 
                                            name={field_key} 
                                            label={label || ''}
                                            options={options} 
                                            register={register}
                                        />
                                    ) : field_type === 'radioButton' ? (
                                        <RadioButton 
                                            validation={{required: required ? `${label} is required` : false}}
                                            error={error as FieldError} 
                                            name={field_key} 
                                            label={label || ''}
                                            register={register} 
                                            options={options}
                                        />
                                    ) : (
                                        <div className="space-y-1">
                                            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
                                            <TextInput
                                                name={field_key}
                                                placeholder={required ? `${placeholder}*` : placeholder}
                                                register={register}
                                                validation={{required: required ? `${label || field_key} is required` : false}}
                                                error={error as FieldError}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div className={`form-group ${career ? 'career-button' : ''}`}>
                            <div className="submit-wrapper">
                                <Button
                                    text={isLoading ? 'Submitting...' : 'Submit Message'}
                                    background='var(--var-dc--primary-color)'
                                    hoverBackground='var(--var-dc--secondary-color)'
                                    color='#FFF'
                                    hoverColor='#FFF'
                                    fontSize={18}
                                    borderRadius={8}
                                    margin="30px 0 0 0"
                                    fontWeight={500}
                                    border='1px solid var(--var-dc--primary-color)'
                                    onClick={handleSubmit(onSubmit, onError)}
                                    className={isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default React.memo(FormContact);