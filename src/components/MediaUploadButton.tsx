import React, { useRef } from "react";

interface MediaUploadButtonProps {
   value?: string;
   onChange: (url: string) => void;
}

const MediaUploadButton: React.FC<MediaUploadButtonProps> = ({ value, onChange }) => {
   const inputRef = useRef<HTMLInputElement>(null);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         // For demo: use local URL. Replace with upload logic as needed.
         const url = URL.createObjectURL(file);
         onChange(url);
      }
   };

   return (
      <div>
         <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
         >
            {value ? "Change Image" : "Upload Image"}
         </button>
         <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
      </div>
   );
};

export { MediaUploadButton };
