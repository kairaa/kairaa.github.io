'use client';

import React, { useState } from 'react';
import { apiClient } from '../../_lib/apiClient';

export default function ApiTestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing login with ApiClient...');
    
    try {
      const response = await apiClient.login('admin@example.com', 'admin123');
      setResult('ApiClient Login Response:\n' + JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`ApiClient Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testRealApi = async () => {
    setLoading(true);
    setResult('Testing real API...');
    
    try {
      const response = await fetch('https://gw.kaira.me/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'admin123'
        }),
      });
      
      const data = await response.json();
      setResult('Direct Fetch Response:\n' + JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: data
      }, null, 2));
    } catch (error: any) {
      setResult(`Direct Fetch Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testCors = async () => {
    setLoading(true);
    setResult('Testing CORS...');
    
    try {
      // First test OPTIONS preflight
      console.log('Testing OPTIONS preflight...');
      const optionsResponse = await fetch('https://gw.kaira.me/api/login', {
        method: 'OPTIONS',
        mode: 'cors',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
          'Origin': window.location.origin
        },
      });
      
      console.log('OPTIONS response:', {
        status: optionsResponse.status,
        headers: Object.fromEntries(optionsResponse.headers.entries())
      });

      // Then test actual POST
      console.log('Testing actual POST...');
      const response = await fetch('https://gw.kaira.me/api/login', {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123'
        }),
      });
      
      const data = await response.json();
      setResult('CORS Test Results:\n' + 
        'OPTIONS Status: ' + optionsResponse.status + '\n' +
        'OPTIONS Headers: ' + JSON.stringify(Object.fromEntries(optionsResponse.headers.entries()), null, 2) + '\n\n' +
        'POST Response:\n' + JSON.stringify({
          status: response.status,
          ok: response.ok,
          data: data
        }, null, 2));
    } catch (error: any) {
      setResult(`CORS Test Error: ${error}\nError Name: ${error.name}\nError Message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCustomCredentials = async () => {
    if (!customEmail || !customPassword) {
      setResult('Please enter email and password');
      return;
    }

    setLoading(true);
    setResult('Testing with custom credentials...');
    
    try {
      console.log('Testing custom credentials:', { email: customEmail });
      const response = await apiClient.login(customEmail, customPassword);
      setResult('Custom Credentials Test:\n' + JSON.stringify(response, null, 2));
    } catch (error: any) {
      setResult(`Custom Credentials Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSimpleGet = async () => {
    setLoading(true);
    setResult('Testing simple GET request...');
    
    try {
      const response = await fetch('https://gw.kaira.me/api/healthz', {
        method: 'GET',
        mode: 'cors',
      });
      
      const text = await response.text();
      setResult('Simple GET Test:\n' + JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: text
      }, null, 2));
    } catch (error: any) {
      setResult(`Simple GET Error: ${error}\nError Name: ${error.name}\nError Message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">API Test Page</h1>
        
        {/* Custom credentials form */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Test with Your Credentials</h2>
          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter your password"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={testCustomCredentials}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Custom Credentials'}
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">API Endpoint Information</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <strong>Base URL:</strong> https://gw.kaira.me/api
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <strong>Login Endpoint:</strong> POST /login
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Expected Format:</strong> {`{email: string, password: string}`}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={testLogin}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API Client Login'}
          </button>
          
          <button
            onClick={testRealApi}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Test Direct Fetch'}
          </button>

          <button
            onClick={testCors}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Test CORS'}
          </button>

          <button
            onClick={testSimpleGet}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Test Simple GET'}
          </button>

          <button
            onClick={testSimpleGet}
            disabled={loading}
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Test Simple GET'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Result:</h2>
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {result || 'Click a button to test the API'}
          </pre>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Custom Credentials Test:</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={customPassword}
              onChange={(e) => setCustomPassword(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={testCustomCredentials}
              disabled={loading}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Custom Credentials'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
