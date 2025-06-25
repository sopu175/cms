import React from 'react';
import { UseFormRegister, FieldValues, FieldError } from 'react-hook-form';

// Define types for props to be passed into the CheckBox component
interface CheckBoxProps {
    name: string; // Name of the input field (used for registration with react-hook-form)
    label: string; // The label displayed for the checkbox group
    register: UseFormRegister<FieldValues>; // React Hook Form register function for form handling
    validation?: Record<string, unknown>; // Optional validation rules for the checkbox field
    error?: FieldError; // Optional error object to display validation errors
    options: string; // Options for checkboxes in the format "value:Label" (e.g., "male:Male,female:Female")
}

const CheckBox: React.FC<CheckBoxProps> = ({
                                               name,            // The name attribute for the input field
                                               label,           // The label displayed above the checkboxes
                                               register,        // react-hook-form register function
                                               validation,      // Validation rules for the field (optional)
                                               error,           // Error message (optional)
                                               options,         // Options for checkboxes in string format
                                           }) => {
    // Parse the options string into an array of objects with value and label properties
    const parsedOptions = options.split(',').map((option) => {
        const [value, label] = option.split(':');
        return { value, label }; // Return an object with value and label properties
    });

    return (
        <div className="relative flex grid space-y-2">
            {/* Display the label for the checkbox group */}
            <div className="font-semibold text-gray-700">{label}</div>

            {/* Render each checkbox option */}
            {parsedOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                    {/* Checkbox input */}
                    <input
                        type="checkbox"
                        id={`${name}_${option.value}`} // ID of each checkbox is based on the name and value
                        value={option.value} // The value that will be submitted for the checkbox
                        className={`w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-transparent ${
                            error ? 'border-red-500' : 'border-gray-300'
                        }`} // Tailwind styling with conditional border color based on error
                        {...register(name, validation)} // Register input with react-hook-form with validation
                    />
                    {/* Label for each checkbox */}
                    <label htmlFor={`${name}_${option.value}`} className="text-gray-700">
                        {option.label}
                    </label>
                </div>
            ))}

            {/* Display error message if there's any validation error */}
            {error && (
                <span className="text-sm text-red-500 mt-1">{error.message}</span>
            )}
        </div>
    );
};

export default CheckBox;
