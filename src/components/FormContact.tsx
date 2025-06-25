'use client';
import React, { useRef, useState, useCallback } from 'react';
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
                                                     formData,
                                                     form_id,
                                                     career,
                                                 }) => {
    const { register, handleSubmit, formState, reset, setValue, control } = useForm({ mode: 'all' });
    const { errors } = formState;
    const [selectUploadMessage, setSelectUploadMessage] = useState('Attach CV');
    const cvRef = useRef<HTMLInputElement | null>(null);
    const [cv, setCv] = useState<File | null>(null);

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
            console.log(selectedOption)
        },
        [setValue]
    );

    const onSubmit = async (data: Record<string, unknown>) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });

            if (cv) {
                formData.append('file', cv);
            }
            formData.append('form_id', form_id || 'career_form7');

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/post-req-data/form-submit`,
                formData
            );

            if (response?.data?.result === 'success') {
                toast.success(response?.data?.message);

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
        }
    };

    const onError = (errors: Record<string, unknown>) => {
        const count = Object.values(errors).length;
        if (count > 0) {
            toast.error('Please fill out the correct inputs');
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


    return (
        <section className={'bg-[#f5f5f5] pb-[120px] pt-[120px]'}>
            <div className={'container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
                <div
                    className={`relative ${asModal ? 'modal' : ''} ${padding || ''}`}
                    id={id || 'FormContact'}
                >
                    <Title tag='h2' margin={'0 0 60px'} fontFamily='var(--var-dc--font-mono)'
                           spanColor='var(--var-dc--error-color)' color='var(--var-dc--background)' textAlign='left'>
                        Form Components
                    </Title>
                    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                        <input name="spam_protector" type="hidden"/>
                        <input name="form_id" value="contact-form" type="hidden"/>

                        {formData?.map((field, index) => {
                            const {field_key, field_type, placeholder, label, validators, options} = field as {
                                field_key: string;
                                field_type: string;
                                placeholder: string;
                                label: string;
                                validators: string;
                                options: string;
                            };
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
                                                className="absolute inset-0 opacity-0"
                                                id="file-input"
                                                type="file"
                                                accept="application/pdf"
                                            />
                                            <button
                                                type="button"
                                                className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-none border"
                                            >
                                                {selectUploadMessage}
                                            </button>
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
                                            )}
                                        />
                                    ) : field_type === 'checkBox' ? (
                                        <CheckBox
                                            validation={{required: required ? `${label ? label + 'is required' : 'Check the terms and Conditions before Submit'}` : false}}
                                            error={error as FieldError} name={field_key} label={placeholder}
                                            options={options} register={register}/>
                                    ) : field_type === 'radioButton' ? (
                                        <RadioButton validation={{required: required ? `${label} is required` : false}}
                                                     error={error as FieldError} name={field_key} label={placeholder}
                                                     register={register} options={options}/>
                                    ) : (
                                        <TextInput
                                            name={field_key}
                                            placeholder={required ? `${placeholder}*` : placeholder}
                                            register={register}
                                            validation={{required: required ? `${label} is required` : false}}
                                            error={error as FieldError}
                                        />
                                    )}
                                </div>
                            );
                        })}

                        <div className={`form-group ${career ? 'career-button' : ''}`}>
                            <div className="submit-wrapper" onSubmit={handleSubmit(onSubmit, onError)}
                                 onClick={handleSubmit(onSubmit, onError)}>
                                <Button text={'Submit Message'}/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default React.memo(FormContact);