import React, { useState } from 'react';
import MediaLibrary from './MediaLibrary';
import { Media } from '../types';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media[]) => void;
}

const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [selected, setSelected] = useState<Media[]>([]);
  const [clearSelection, setClearSelection] = useState(false);

  if (!isOpen) return null;

  const handleSelect = () => {
    onSelect(selected);
    setSelected([]);
    setClearSelection(true);
    onClose();
    setTimeout(() => setClearSelection(false), 100); // reset for next open
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <span className="text-2xl">×</span>
        </button>
        <h2 className="text-xl font-semibold mb-4">Media Library</h2>
        <MediaLibrary
          onSelect={setSelected}
          selectedMedia={selected}
          clearSelection={clearSelection}
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            disabled={selected.length === 0}
            onClick={handleSelect}
          >
            Select ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaLibraryModal; 