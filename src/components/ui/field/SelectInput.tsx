'use client';

import React from 'react';
import { components, DropdownIndicatorProps, StylesConfig } from 'react-select';
import Select from 'react-select';

// Define types for the props of SelectInput component
interface SelectInputProps {
    name: string; // The name attribute for the select input field, used for form registration
    value?: { value: string; label: string } | null; // The currently selected value in { value, label } format
    placeholder?: string; // Placeholder text to show when no option is selected
    options?: { value: string; label: string }[]; // Array of options for the select dropdown
    onChange?: (value: { value: string; label: string } | null) => void; // Callback for when the selection changes
    error?: { message: string }; // Error message to display if validation fails
}

// Create CaretDownIcon component for the custom dropdown indicator (caret icon)
const CaretDownIcon: React.FC<{ iconSmall?: boolean }> = ({ iconSmall }) => {
    return iconSmall ? (
        // Small caret down icon
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3.99983 5.47467L8.0065 1.468L7.06383 0.525338L3.99716 3.592L0.930497 0.525338L-0.00683611 1.468L3.99983 5.47467Z"
                fill="white"
            />
        </svg>
    ) : (
        // Larger caret down icon
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9.5" transform="matrix(-4.37114e-08 1 1 4.37114e-08 0 0)" stroke="#152637" />
            <path d="M13.5703 9.96448L10.0348 13.5" stroke="#152637" strokeLinecap="round" />
            <path d="M10.0352 13.5L6.49962 9.96447" stroke="#152637" strokeLinecap="round" />
            <path d="M10 13.5L10 6.5" stroke="#152637" strokeLinecap="round" />
        </svg>
    );
};

// Custom styles for the Select component using react-select's StylesConfig
const customStyles: StylesConfig<{ value: string; label: string }, false> = {
    // Customize the dropdown indicator (caret icon)
    dropdownIndicator: (base, state) => ({
        ...base,
        transition: '0.7s all ease', // Smooth transition for rotation effect
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : undefined, // Rotate the caret when menu is open
    }),
    // Styling for options in the dropdown menu
    option: (provided, state) => ({
        ...provided,
        borderRadius: 0,
        color: state.isSelected ? `white` : '#152637', // Change text color when selected
        backgroundColor: state.isSelected ? 'green' : 'white', // Green background when selected
        margin: 0,
        fontSize: 18,
        cursor: 'pointer',
        lineHeight: '18px',
        paddingLeft: 10,
        paddingRight: 10,
        fontWeight: state.isSelected ? 400 : 400,
        borderBottom: state.options.indexOf(state.data) === state.options.length - 1 ? 'none' : '1px solid #888888', // Add a bottom border except for the last option
        '&:hover': {
            backgroundColor: 'green', // Hover effect
            color: `white`,
            cursor: 'pointer',
        },
    }),
    // Styling for the menu that displays the options
    menu: (provided) => ({
        ...provided,
        color: '#152637', // Text color
        backgroundColor: 'white !important', // Set background color to white
        margin: '15px 0 0 0', // Add top margin
        borderBottom: `1px solid #888888`, // Border at the bottom of the menu
        padding: 0,
        borderRadius: 0,
        fontSize: 12,
        zIndex: 10, // Ensure the menu is above other elements
    }),
    // Styling for the list of options inside the dropdown
    menuList: (provided) => ({
        ...provided,
        backgroundColor: 'white !important', // Set list background color to white
        borderRadius: 0,
        borderColor: `#152637`, // Set border color
        fontWeight: '400',
        color: 'white', // Text color inside the list
        padding: 0,
        fontSize: 12,
    }),
};

// Custom DropdownIndicator to use the CaretDownIcon component
const DropdownIndicator = (props: DropdownIndicatorProps<{ value: string; label: string }, false>) => {
    return (
        <components.DropdownIndicator {...props}>
            <CaretDownIcon />
        </components.DropdownIndicator>
    );
};

// SelectInput component rendering react-select with custom styles and dropdown indicator
const SelectInput = ({
                         name,
                         value,
                         placeholder,
                         options,
                         onChange,
                         error,
                         ...rest
                     }: SelectInputProps) => {
    return (
        <div className="form-group">
            {/* Render react-select component */}
            <Select
                name={name} // Name attribute for the select field
                value={value} // The currently selected value
                options={options || []} // Options for the select dropdown
                isSearchable={false} // Disable search functionality
                onChange={onChange} // Function to handle changes in selection
                placeholder={placeholder} // Placeholder text when no option is selected
                styles={customStyles} // Apply custom styles
                components={{ DropdownIndicator }} // Use the custom dropdown indicator
                classNamePrefix="react-select" // Class prefix for the Select component
                className={'rounded-none'} // Apply rounded-none class to remove borders
                {...rest} // Spread additional props
            />
            {/* Display error message if provided */}
            {error && <span className="error-message text-red-500 text-sm">{error.message}</span>}
        </div>
    );
};

// Set display name for debugging purposes
SelectInput.displayName = 'SelectInput';

// Export the SelectInput component for usage in other parts of the application
export { SelectInput };
export default SelectInput;
