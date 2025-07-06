"use client";

import React, { useState, useEffect } from 'react';
import { AmuletCard } from '@/components/amulet-card';
import { AmuletSearch } from '@/components/amulet-search';
import type { Amulet } from '@/lib/types';
import { motion } from 'framer-motion';
import { Logo } from '@/components/logo';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

export default function Home() {
  const [allAmulets, setAllAmulets] = useState<Amulet[]>([]);
  const [filteredAmulets, setFilteredAmulets] = useState<Amulet[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "amulets"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const amuletsData: Amulet[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        amuletsData.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString(),
          auctionEndTime: data.auctionEndTime?.toDate ? data.auctionEndTime.toDate().toISOString() : data.auctionEndTime,
        } as Amulet);
      });
      setAllAmulets(amuletsData);
      setFilteredAmulets(amuletsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching amulets: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredAmulets(allAmulets);
      setSearchResults(null);
      return;
    }
    const filtered = allAmulets.filter((amulet) =>
      amulet.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAmulets(filtered);
    setSearchResults(null);
  };
  
  const handleAiSearchResults = (results: string) => {
    setSearchResults(results);
    setFilteredAmulets([]); 
  };
  
  const clearSearch = () => {
    setSearchResults(null);
    setFilteredAmulets(allAmulets);
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) searchInput.value = '';
  }

  const renderContent = () => {
    if (isLoading || isSearching) {
      return (
        <div className="text-center py-16 flex flex-col items-center justify-center gap-4">
          <Logo className="h-16 w-16 animate-spin" />
          <p className="text-muted-foreground">{isSearching ? 'กำลังค้นหาปัญญาจากจักรวาล...' : 'กำลังโหลดข้อมูลพระเครื่อง...'}</p>
        </div>
      );
    }

    if (searchResults) {
      return (
        <div className="mt-8 text-center p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-headline mb-4">ผลการค้นหาด้วย AI</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{searchResults}</p>
          <button onClick={clearSearch} className="mt-4 text-primary hover:underline">ล้างการค้นหา</button>
        </div>
      );
    }
    
    if (filteredAmulets.length === 0 && !isLoading) {
      return (
        <div className="text-center py-16">
          <p className="text-muted-foreground">ไม่พบพระเครื่องที่กำลังแสดง</p>
          <button onClick={clearSearch} className="mt-4 text-primary hover:underline">แสดงพระเครื่องทั้งหมด</button>
        </div>
      );
    }

    return (
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {filteredAmulets.map((amulet) => (
          <AmuletCard key={amulet.id} amulet={amulet} />
        ))}
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-gradient">
          ตลาดพระเครื่อง NFT
        </h1>
        <p className="text-lg max-w-3xl mx-auto text-muted-foreground">
          ค้นพบ ประมูล และเป็นเจ้าของพระเครื่องดิจิทัลที่ไม่เหมือนใคร
          ขับเคลื่อนด้วยเทคโนโลยี AI เพื่อการวิเคราะห์ที่แม่นยำและโปร่งใส
        </p>
      </header>

      <AmuletSearch onSearch={handleSearch} onAiSearch={handleAiSearchResults} setLoading={setIsSearching} />
      
      {renderContent()}
    </div>
  );
}
