import React, { useRef, useState } from "react";
import { Upload, Image } from "lucide-react";
import { useMedia } from "../hooks/useMedia";

interface MediaUploadButtonProps {
   value?: string;
   onChange: (url: string) => void;
}

export const MediaUploadButton: React.FC<MediaUploadButtonProps> = ({ value, onChange }) => {
   const inputRef = useRef<HTMLInputElement>(null);
   const [uploading, setUploading] = useState(false);
   const { uploadMedia } = useMedia();

   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setUploading(true);
         try {
            const result = await uploadMedia(file);
            if (result.success && result.data) {
               onChange(result.data.url);
            } else {
               console.error("Upload failed:", result.error);
            }
         } catch (error) {
            console.error("Upload error:", error);
         } finally {
            setUploading(false);
         }
      }
   };

   const handleBrowseMedia = () => {
      // This would typically open a media browser modal
      // For now, we'll just trigger the file input
      inputRef.current?.click();
   };

   return (
      <div className="flex items-center space-x-2">
         <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-1"
            disabled={uploading}
         >
            <Upload className="w-4 h-4" />
            <span>{uploading ? "Uploading..." : "Upload"}</span>
         </button>
         
         <button
            type="button"
            onClick={handleBrowseMedia}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-1"
         >
            <Image className="w-4 h-4" />
            <span>Browse</span>
         </button>
         
         <input 
            ref={inputRef} 
            type="file" 
            accept="image/*" 
            style={{ display: "none" }} 
            onChange={handleFileChange} 
         />
      </div>
   );
};

export default MediaUploadButton;