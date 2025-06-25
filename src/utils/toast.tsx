// Importing the 'toast' function from the 'sonner' package for creating toasts (notifications)
import { toast } from 'sonner';

/**
 * Success Toast Function
 * This function triggers a success toast message with a custom green background and white text.
 * It uses Tailwind CSS for custom styling.
 *
 * @param {string} msg - The message to be displayed in the success toast.
 */
export const successToast = (msg: string) => {
    toast.success(msg, {
        position: 'top-right', // Position the toast at the top-right of the screen
        duration: 4000, // Set the duration for the toast to be visible (in milliseconds)
        className: 'bg-green-500 text-white', // Custom Tailwind classes for a green background and white text
    });
};

/**
 * Error Toast Function
 * This function triggers an error toast message with a custom red background and white text.
 * It uses Tailwind CSS for custom styling.
 *
 * @param {string} msg - The message to be displayed in the error toast.
 */
export const errorToast = (msg: string) => {
    toast.error(msg, {
        position: 'top-right', // Position the toast at the top-right of the screen
        duration: 4000, // Set the duration for the toast to be visible (in milliseconds)
        className: 'bg-red-500 text-white', // Custom Tailwind classes for a red background and white text
    });
};
