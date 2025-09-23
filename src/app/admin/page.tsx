'use client';

import { useState } from 'react';
import { Button, Spinner } from '@/components/ui/Button';
import { seedDatabase } from '@/lib/seedData/sampleTrucks';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedDatabase = async () => {
    setLoading(true);
    setMessage('');

    try {
      const result = await seedDatabase();
      setMessage(`Successfully seeded database with ${result.data.count} trucks!`);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to seed database'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Database Management
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Seed the database with sample food truck data for development and testing.
            </p>
            
            <Button
              onClick={handleSeedDatabase}
              disabled={loading}
              className="w-full flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Seeding...
                </>
              ) : (
                'Seed Database'
              )}
            </Button>
          </div>
          
          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-800 border border-red-200' 
                : 'bg-green-50 text-green-800 border border-green-200'
            }`}>
              {message}
            </div>
          )}
          
          <div className="pt-4 border-t">
            <h3 className="text-md font-medium text-gray-900 mb-2">
              Quick Links
            </h3>
            <div className="space-y-2">
              <a
                href="/map"
                className="block text-blue-600 hover:text-blue-800 text-sm"
              >
                → View Map
              </a>
              <a
                href="/api/trucks"
                className="block text-blue-600 hover:text-blue-800 text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                → API Endpoint
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}