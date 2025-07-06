"use client"

import React, { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';
import { aiAmuletSearch } from '@/ai/flows/ai-amulet-search';
import { useToast } from '@/hooks/use-toast';

interface AmuletSearchProps {
  onSearch: (query: string) => void;
  onAiSearch: (results: string) => void;
  setLoading: (isLoading: boolean) => void;
}

export function AmuletSearch({ onSearch, onAiSearch, setLoading }: AmuletSearchProps) {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleAiSearch = () => {
    if (!query) {
        toast({
            title: "คำค้นหาว่างเปล่า",
            description: "กรุณาป้อนคำอธิบายเพื่อค้นหาด้วย AI",
            variant: "destructive",
        });
        return;
    }
    startTransition(async () => {
      setLoading(true);
      const { results, error } = await aiAmuletSearch({ query });
      setLoading(false);
      if (error) {
        console.error(error);
        toast({
          title: "การค้นหาด้วย AI ล้มเหลว",
          description: "ไม่สามารถรับผลลัพธ์จาก AI ได้ โปรดลองอีกครั้ง",
          variant: "destructive",
        });
        return;
      }
      onAiSearch(results);
    });
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <form onSubmit={handleFormSubmit} className="flex gap-2 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ค้นหาเครื่องรางตามชื่อหรือถาม AI..."
            className="pl-10 h-12 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button
          type="button"
          size="lg"
          className="h-12 bg-gradient-to-r from-accent to-orange-600 text-white"
          onClick={handleAiSearch}
          disabled={isPending}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          <span>{isPending ? 'กำลังปรึกษา...' : 'ค้นหาด้วย AI'}</span>
        </Button>
      </form>
    </div>
  );
}
