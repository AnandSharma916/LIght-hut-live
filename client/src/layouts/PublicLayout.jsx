import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { SmoothScroll } from '../components/common/SmoothScroll';
import { AmbientLightCursor } from '../components/common/AmbientLightCursor';
import { FloatingActionWidget } from '../components/common/FloatingActionWidget';

export const PublicLayout = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-[#090a0d] text-neutral-200 relative">
        <AmbientLightCursor />
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <FloatingActionWidget />
      </div>
    </SmoothScroll>
  );
};
