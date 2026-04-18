import Nav from '@/components/global/Header'
import Header from '@/components/global/Header'
import Sidebar from '@/components/global/sidebar/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const MainLayout = ({ children }) => {
    return (
        <div className='w-full h-screen flex flex-col'>
            <Nav />
            <main className='w-full flex-1 bg-linear-to-br from-tertiary from-5% to-neutral to-90%'>
                {children}
            </main>
        </div>
    )
}

export default MainLayout