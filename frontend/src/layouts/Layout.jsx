import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
