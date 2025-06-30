import React, { useRef, useState } from 'react';
import { useMedia } from '../hooks/useMedia';

export const MediaUploadTest: React.FC = () => {
  const { uploadMedia } = useMedia();
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('Starting upload...');
    setError('');

    try {
      const result = await uploadMedia(file);
      if (result.success) {
        setStatus('Upload successful!');
        console.log('Upload result:', result.data);
      } else {
        setError(`Upload failed: ${result.error}`);
        if ('details' in result) { console.error('Upload error details:', (result as any).details); }
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Media Upload Test</h2>
      
      <div className="space-y-4">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {status && (
          <div className="text-green-600 bg-green-50 p-3 rounded">
            {status}
          </div>
        )}

        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}; 