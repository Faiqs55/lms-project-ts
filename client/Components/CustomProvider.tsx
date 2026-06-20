// Components/CustomProvider.tsx
"use client";
import { useLoadUserQuery } from '@/redux/features/api/apiSlice'
import React, { FC, useEffect, useState } from 'react'
import Loader from './Loader/Loader';
const CustomProvider: FC<{children: React.ReactNode}> = ({children}) => {
    const {isLoading} = useLoadUserQuery({});
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    // During hydration, we MUST render the same thing as the server.
    // Since server doesn't know about user loading state yet, 
    // we render children first, then switch to Loader if needed after mount.
    if (!mounted) {
        return <>{children}</>;
    }
    return <>{isLoading ? <Loader /> : <div>{children}</div>}</>;
}
export default CustomProvider;