// components/LoadingSpinner.tsx
'use client';

import {ClipLoader} from 'react-spinners';

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100  ">
            <ClipLoader size={50} color="#3498db" loading={true}/>
        </div>
    );
}
