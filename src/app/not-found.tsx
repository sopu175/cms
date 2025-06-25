// app/not-found.tsx
'use client';

import { useRouter } from 'next/navigation';
import Button from "@/components/ui/Button";

export default function NotFound() {
    const router = useRouter();

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <div className="flex items-center flex-col justify-center min-h-screen bg-gray-100 text-center p-4">
                <h1 className="text-5xl font-extrabold text-red-600">404</h1>
                <p className="mt-4 text-xl text-gray-700">
                    Oops! The page you&apos;re looking for doesn&apos;t exist.
                </p>
                <Button
                    margin={'30px 0 0'}
                    text={'Return To Home'}
                    src={"/"}
                    onClick={handleGoHome}
                />

        </div>
    );
}
