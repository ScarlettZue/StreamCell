import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} subtitle={subtitle} />
        <main className="flex-1 p-8 ml-64 overflow-y-auto animate-fade-in">{children}</main>
      </div>
    </div>
  );
};
