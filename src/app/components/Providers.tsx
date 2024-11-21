// components/Providers.tsx
'use client';

import React from 'react';
import { SessionProvider } from "next-auth/react";
import { CartProvider } from '@/context/cartContext';

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </SessionProvider>
    );
};

export default Providers;
