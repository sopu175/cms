import React, { useState } from "react";
import { Image } from "lucide-react";
import MediaLibraryModal from "./MediaLibraryModal";
import { Media } from "../types";

interface MediaUploadButtonProps {
   onChange: (urls: string[]) => void;
   buttonText?: string;
}

export const MediaUploadButton: React.FC<MediaUploadButtonProps> = ({ onChange, buttonText = "Select Images" }) => {
   const [showModal, setShowModal] = useState(false);

   const handleSelect = (media: Media[]) => {
      onChange(media.map(m => m.url));
   };

   return (
      <>
         <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-1"
         >
            <Image className="w-4 h-4" />
            <span>{buttonText}</span>
         </button>
         <MediaLibraryModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSelect={(media) => {
               handleSelect(media);
               setShowModal(false);
            }}
         />
      </>
   );
};

export default MediaUploadButton;