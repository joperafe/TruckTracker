'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, MapPin, Search, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
  onMobileMenuToggle?: () => void;
}

export function Navigation({ className, onMobileMenuToggle }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    onMobileMenuToggle?.();
  };

  return (
    <nav className={cn(
      "bg-white border-b border-gray-200 shadow-sm",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-md">
                🚚
              </div>
              <span className="text-xl font-bold text-gray-900">
                TruckTracker
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/map"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Map</span>
            </Link>
            
            <Link
              href="/search"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>
            
            <Link
              href="/trucks"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <List className="w-4 h-4" />
              <span>All Trucks</span>
            </Link>
            
            <Button size="sm">
              Add Your Truck
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/map"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              <MapPin className="w-5 h-5" />
              <span>Map View</span>
            </Link>
            
            <Link
              href="/search"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </Link>
            
            <Link
              href="/trucks"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              <List className="w-5 h-5" />
              <span>All Trucks</span>
            </Link>
            
            <div className="px-3 py-2">
              <Button size="sm" className="w-full">
                Add Your Truck
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}