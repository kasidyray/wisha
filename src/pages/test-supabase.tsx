import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  message?: string;
}

const TestSupabase = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { user } = useAuth();

  const addResult = (name: string, status: 'success' | 'error' | 'pending', message?: string) => {
    setResults(prev => [...prev, { name, status, message }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const runTests = async () => {
    setIsRunning(true);
    clearResults();
    
    // Test 1: Basic connection
    addResult('Connection Test', 'pending');
    try {
      const { error } = await supabase.from('users').select('count').limit(1);
      if (error) {
        addResult('Connection Test', 'error', error.message);
      } else {
        addResult('Connection Test', 'success', 'Successfully connected to Supabase');
      }
    } catch (error: any) {
      addResult('Connection Test', 'error', error.message);
    }

    // Test 2: Check user authentication
    addResult('Auth Status', 'pending');
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        addResult('Auth Status', 'error', error.message);
      } else {
        addResult('Auth Status', 'success', data.session ? 'User is authenticated' : 'No active session');
      }
    } catch (error: any) {
      addResult('Auth Status', 'error', error.message);
    }

    // Test 3: Test RLS policies
    if (user) {
      addResult('RLS Policy Test', 'pending');
      try {
        // Try to get current user profile (should work with RLS)
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          addResult('RLS Policy Test', 'error', `Error fetching own profile: ${error.message}`);
        } else {
          addResult('RLS Policy Test', 'success', 'Successfully retrieved own user profile');
        }
      } catch (error: any) {
        addResult('RLS Policy Test', 'error', error.message);
      }
    }

    setIsRunning(false);
  };

  // Run tests automatically on component mount
  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="mb-6">
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          variant="airbnb"
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </Button>
      </div>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg">{result.name}</h3>
                {result.message && <p className="text-gray-600 text-sm mt-1">{result.message}</p>}
              </div>
              <div>
                {result.status === 'pending' && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Running...</span>
                )}
                {result.status === 'success' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Success</span>
                )}
                {result.status === 'error' && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">Error</span>
                )}
              </div>
            </div>
          </Card>
        ))}
        
        {results.length === 0 && !isRunning && (
          <p className="text-gray-500">No tests have been run yet.</p>
        )}
      </div>

      {user && (
        <div className="mt-8 p-4 border rounded-lg">
          <h3 className="font-medium text-lg mb-2">Current User Info</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestSupabase; 