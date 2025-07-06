
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AmuletCard } from '@/components/amulet-card';
import { amulets as allAmulets } from '@/lib/data';
import type { User, Amulet } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [myAmulets, setMyAmulets] = useState<Amulet[]>([]);
  const [myCollection, setMyCollection] = useState<Amulet[]>([]);
  const router = useRouter();

  useEffect(() => {
    // In a real app, this would come from an API call or context
    const userJson = window.localStorage.getItem('amulet-user');
    if (userJson) {
      const currentUser = JSON.parse(userJson);
      setUser(currentUser);
      
      // Mock fetching user-specific data
      // Using a mock userId 'user-101' for demo purposes, as this user has listings
      setMyAmulets(allAmulets.filter(a => a.userId === 'user-101')); 
      // Mock collection data, let's take a few different ones for display
      setMyCollection([allAmulets[0], allAmulets[3]]);
    } else {
        // Redirect to login if no user is found
        router.push('/login');
    }
  }, [router]);

  if (!user) {
    // This can show a loading state or null while redirecting
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <p>กำลังโหลดข้อมูลผู้ใช้...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <Avatar className="h-32 w-32 border-4 border-primary">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-4xl font-headline font-bold">{user.name}</h1>
          {user.email && <p className="text-muted-foreground mt-2">{user.email}</p>}
          {/* We can add more profile info here like follower counts in the future */}
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/list-amulet">
            <PlusCircle className="mr-2 h-4 w-4" />
            ลงประกาศพระเครื่องใหม่
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="my-amulets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-amulets">พระเครื่องของฉัน</TabsTrigger>
          <TabsTrigger value="my-collection">คอลเลกชัน</TabsTrigger>
        </TabsList>
        <TabsContent value="my-amulets">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
            {myAmulets.length > 0 ? (
              myAmulets.map(amulet => <AmuletCard key={amulet.id} amulet={amulet} />)
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-12">คุณยังไม่ได้ลงประกาศพระเครื่อง</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="my-collection">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
            {myCollection.length > 0 ? (
              myCollection.map(amulet => <AmuletCard key={amulet.id} amulet={amulet} />)
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-12">คอลเลกชันของคุณว่างเปล่า</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
