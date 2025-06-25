import React from 'react';
import { UseFormRegister, FieldValues, FieldError } from 'react-hook-form';

// Define types for props passed into the RadioButton component
interface RadioButtonProps {
    name: string; // Name for the radio button group
    label: string; // Label displayed above the radio buttons
    register: UseFormRegister<FieldValues>; // react-hook-form register function
    validation?: Record<string, unknown>; // Optional validation rules for the radio button field
    error?: FieldError; // Optional error object to display validation errors
    options: string; // Options for radio buttons in the format "value:Label" (e.g., "male:Male,female:Female")
}

const RadioButton: React.FC<RadioButtonProps> = ({
                                                     name,           // The name of the input field
                                                     label,          // The label for the radio group
                                                     register,       // react-hook-form's register function
                                                     validation,     // Validation rules (optional)
                                                     error,          // Error message (optional)
                                                     options,        // Options for radio buttons in "value:Label" format
                                                 }) => {
    // Parse the options string into an array of objects
    const parsedOptions = options.split(',').map((option) => {
        const [value, label] = option.split(':'); // Split each option into value and label
        return { value, label }; // Return an object with value and label properties
    });

    return (
        <div className="relative flex grid space-y-2">
            {/* Display the label for the radio group */}
            <div className="font-semibold text-gray-700">{label}</div>

            {/* Render each radio button option */}
            {parsedOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                    {/* Radio button input */}
                    <input
                        type="radio"
                        id={`${name}_${option.value}`} // Unique ID for each radio button
                        value={option.value} // The value of the radio button
                        className={`w-5 h-5 text-blue-500 border-gray-300 focus:transparent focus:ring-transparent ${
                            error ? 'border-red-500' : 'border-gray-300'
                        }`} // Tailwind classes with conditional error styling
                        {...register(name, validation)} // Register radio button with react-hook-form
                    />
                    {/* Label for each radio button */}
                    <label htmlFor={`${name}_${option.value}`} className="text-gray-700">
                        {option.label}
                    </label>
                </div>
            ))}

            {/* Display error message if there's an error */}
            {error && (
                <span className="text-sm text-red-500 mt-1">{error.message}</span>
            )}
        </div>
    );
};

export default RadioButton;
