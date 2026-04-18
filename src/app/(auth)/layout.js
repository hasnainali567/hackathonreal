import Nav from '@/components/global/Header'
import React from 'react'
import { Toaster } from 'sonner'

const AuthLayout = ({ children }) => {
    return (
        <div className='w-full min-h-screen flex flex-col  '>
            <Nav />
            <Toaster position='top-right' />
            {children}
        </div>
    )
}

export default AuthLayout