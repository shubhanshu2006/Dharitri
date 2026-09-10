"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface ProjectCodeResponse {
  lastCode: string | null;
  suggestedCode: string;
  year: number;
}

export function useNextProjectCode() {
  const { getToken } = useAuth();
  const [data, setData] = useState<ProjectCodeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNextCode = async () => {
      try {
        setLoading(true);
        
        // Get auth token
        const token = await getToken();
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/next-code`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', response.status, errorText);
          throw new Error(`Failed to fetch next project code: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching next project code:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback to default code
        const year = new Date().getFullYear();
        setData({
          lastCode: null,
          suggestedCode: `PRJ-${year}-001`,
          year,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNextCode();
  }, [getToken]);

  return {
    suggestedCode: data?.suggestedCode || '',
    lastCode: data?.lastCode || null,
    year: data?.year || new Date().getFullYear(),
    loading,
    error,
  };
}
