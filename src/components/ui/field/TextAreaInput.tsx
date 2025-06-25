'use client'; // Ensures this component runs only in the browser environment

import React from 'react';
import { UseFormRegister, FieldValues, FieldError } from 'react-hook-form';

// Define the props for the TextAreaInput component
interface TextAreaInputProps {
    name: string; // The name of the textarea field (used for registration with react-hook-form)
    placeholder: string; // Placeholder text for the textarea
    rows?: number; // Optional number of rows for the textarea
    register: UseFormRegister<FieldValues>; // React Hook Form's register function for form handling
    validation?: Record<string, unknown>; // Optional validation rules for the textarea
    error?: FieldError; // Optional error object to display validation errors
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
                                                         name,             // The name attribute for the textarea field
                                                         placeholder,      // The placeholder text for the textarea
                                                         rows = 4,         // Default number of rows is 4
                                                         register,         // react-hook-form register function
                                                         validation,       // Optional validation rules
                                                         error,            // Optional error object
                                                     }) => (
    <div className="mb-4"> {/* Container div with margin bottom */}
        {/* Textarea input */}
        <textarea
            id={name} // Unique ID for the textarea
            {...register(name, validation)} // Register the input with react-hook-form and apply validation
            placeholder={placeholder} // Placeholder text for the textarea
            rows={rows} // Number of rows for the textarea (default is 4)
            className={`w-full p-3 border rounded-md resize-vertical focus:outline-none focus:ring-2 ${
                error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
            }`} // Tailwind CSS classes for styling with conditional classes for error state
        />

        {/* Error message display */}
        {error && (
            <p className="mt-1 text-sm text-red-600"> {/* Error message with small red text */}
                {error.message} {/* Display the error message */}
            </p>
        )}
    </div>
);

export default TextAreaInput;
