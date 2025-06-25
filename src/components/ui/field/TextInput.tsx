// components/TextInput.tsx
import React from 'react';
import { UseFormRegister, FieldValues, FieldError } from 'react-hook-form';

// Define types for props passed into the TextInput component
interface TextInputProps {
    name: string; // The name attribute for the input field (used for registration with react-hook-form)
    placeholder: string; // Placeholder text displayed in the input or textarea
    type?: string; // Type of the input (e.g., 'text', 'email', 'password')
    register: UseFormRegister<FieldValues>; // React Hook Form register function for form handling
    validation?: Record<string, unknown>; // Optional validation rules for the input field
    error?: FieldError; // Optional error object to display validation errors
    as?: 'input' | 'textarea'; // Determines whether the component should render as an input or textarea
    value?: string; // The current value of the input field (optional)
}

const TextInput: React.FC<TextInputProps> = ({
                                                 name,             // The name of the input field
                                                 placeholder,      // The placeholder text for the input
                                                 type = 'text',    // Default input type is 'text'
                                                 register,         // react-hook-form's register function
                                                 validation,       // Validation rules (optional)
                                                 error,            // Error message (optional)
                                                 as = 'input',     // Determines if the element is a 'textarea' or 'input'
                                                 value,            // The value for controlled input (optional)
                                             }) => {
    // Conditionally set the element type (either 'input' or 'textarea')
    const InputElement = as === 'textarea' ? 'textarea' : 'input';

    return (
        <div className={`relative flex grid ${value ? 'border-2 border-blue-500' : ''}`}>
            {/* Conditionally render an input or textarea element */}
            <InputElement
                id={name} // Unique ID for the input or textarea
                type={type} // Set the type of the input (e.g., text, email, password)
                placeholder={placeholder} // Placeholder text for the input or textarea
                className={`w-full p-2 border rounded-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-transparent ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`} // Tailwind CSS classes for styling, including conditional styling for errors
                {...register(name, validation)} // Register the input with react-hook-form
                value={value} // Controlled component value (optional)
            />
            {/* Display error message if there is an error */}
            {error && (
                <span className="text-sm text-red-500 mt-1">{error.message}</span>
            )}
        </div>
    );
};

export default TextInput;
