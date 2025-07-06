
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthButton } from '@/components/auth-button';
import type { User } from '@/lib/types';

export default function HeaderActions() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const userJson = window.localStorage.getItem('amulet-user');
      if (userJson) {
        setUser(JSON.parse(userJson));
      } else {
        setUser(null);
      }
    };

    handleStorageChange(); // Initial check
    window.addEventListener('storage', handleStorageChange); // Listen for changes

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="flex flex-1 items-center justify-end space-x-2">
      {user && (
        <Button asChild>
          <Link href="/list-amulet">
            <PlusCircle />
            <span>ลงประกาศ</span>
          </Link>
        </Button>
      )}
      <ThemeToggle />
      <AuthButton />
    </div>
  );
}
