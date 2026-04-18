import Nav from '@/components/global/Header'
import { ProtectedLayout } from '@/components/ProtectedLayout'
import React from 'react'

const MainLayout = ({ children }) => {
    return (
        <div className='w-full h-screen flex flex-col'>
            <Nav />
            <main className='w-full flex-1 bg-linear-to-br from-tertiary from-5% to-neutral to-90%'>
                <ProtectedLayout>
                    {children}
                </ProtectedLayout>
            </main>
        </div>
    )
}

export default MainLayout