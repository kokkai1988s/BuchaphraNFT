"use client";

import React, { useState, useTransition, useEffect } from 'react';
import type { Amulet } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Sparkles, Wand, BookOpen, LoaderCircle, User, Clock, Hammer, Wallet, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { enhanceAmuletDescription } from '@/ai/flows/enhance-amulet-description';
import { getAmuletCareTips } from '@/ai/flows/get-amulet-care-tips';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import ImageGallery from './image-gallery';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import PriceHistoryChart from './price-history-chart';

function Countdown({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const distance = formatDistanceToNow(new Date(endDate), { locale: th, addSuffix: true });
      setTimeLeft(distance);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-5 w-5 text-primary" />
      <span className="text-lg font-semibold text-primary">{timeLeft}</span>
    </div>
  );
}

export default function AmuletDetailsClient({ amulet }: { amulet: Amulet }) {
  const [worships, setWorships] = useState(amulet.worshipCount);
  const [isWorshipped, setIsWorshipped] = useState(false);
  
  const [description, setDescription] = useState(amulet.description);
  const [careTips, setCareTips] = useState<string | null>(null);

  const [isEnhancing, startEnhancing] = useTransition();
  const [isGettingTips, startGettingTips] = useTransition();
  
  const { toast } = useToast();

  const handleWorship = () => {
    if (isWorshipped) {
      setWorships(worships - 1);
    } else {
      setWorships(worships + 1);
    }
    setIsWorshipped(!isWorshipped);
  };
  
  const handleEnhanceDescription = () => {
    startEnhancing(async () => {
      const { output, error } = await enhanceAmuletDescription({ amuletDescription: description });
      if (error) {
        console.error(error);
        toast({
          title: "การเพิ่มประสิทธิภาพด้วย AI ล้มเหลว",
          description: "ไม่สามารถเพิ่มประสิทธิภาพคำอธิบายได้ โปรดลองอีกครั้ง",
          variant: "destructive",
        });
        return;
      }
      setDescription(output!.enhancedDescription);
    });
  };

  const handleGetCareTips = () => {
    startGettingTips(async () => {
      const { output, error } = await getAmuletCareTips({ amuletDescription: description });
      if (error) {
        console.error(error);
        toast({
          title: "การรับเคล็ดลับ AI ล้มเหลว",
          description: "ไม่สามารถรับเคล็ดลับการดูแลได้ โปรดลองอีกครั้ง",
          variant: "destructive",
        });
        return;
      }
      setCareTips(output!.careTips);
    });
  };

  const getAuctionTypeText = () => {
    switch (amulet.auctionType) {
      case 'fixed': return 'ราคาคงที่';
      case 'up-bid': return 'ราคาปัจจุบัน';
      case 'down-bid': return 'ราคาปัจจุบัน (กำลังลดลง)';
      default: return 'ราคา';
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex flex-col items-center">
            <ImageGallery imageUrls={amulet.imageUrls} alt={amulet.name} />
        </div>

        <div className="space-y-6">
          <Badge variant="secondary" className="text-sm">{amulet.material}</Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-gradient">{amulet.name}</h1>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>ลงประกาศโดย {amulet.userName}</span>
          </div>
          
          <Card className="bg-card/70 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{getAuctionTypeText()}</p>
                  <p className="text-4xl font-bold text-primary">
                    {amulet.currentPrice.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
                  </p>
                </div>
                {amulet.auctionType !== 'fixed' && <Countdown endDate={amulet.auctionEndTime} />}
              </div>

              {amulet.auctionType === 'up-bid' && (
                 <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input type="number" placeholder={`ขั้นต่ำ ${amulet.minBidIncrement?.toLocaleString() || ''} บาท`} className="flex-grow" />
                      <Button size="lg"><Hammer className="mr-2 h-5 w-5"/>เสนอราคา</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">การเสนอราคาขั้นต่ำ: {amulet.minBidIncrement?.toLocaleString('th-TH')} บาท</p>
                 </div>
              )}
               {amulet.auctionType === 'down-bid' && (
                  <Button size="lg" className="w-full"><TrendingDown className="mr-2 h-5 w-5" />ซื้อในราคานี้</Button>
               )}
               {amulet.auctionType === 'fixed' && (
                  <Button size="lg" className="w-full"><Wallet className="mr-2 h-5 w-5" />ซื้อทันที</Button>
               )}
            </CardContent>
          </Card>

          <div className="flex items-center space-x-6">
            <Button onClick={handleWorship} variant={isWorshipped ? 'default' : 'outline'} className="group">
              <Heart className={`mr-2 h-5 w-5 transition-all ${isWorshipped ? 'fill-current text-red-500' : 'group-hover:fill-current group-hover:text-red-500'}`} />
              {isWorshipped ? 'บูชาแล้ว' : 'น่าบูชา'}
            </Button>
            <div className="flex items-center text-lg">
              <Heart className="h-6 w-6 text-red-500/80 mr-2" />
              <span>{worships.toLocaleString()} ผู้บูชา</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between font-headline text-2xl">
                <span>รายละเอียด</span>
                 <Button onClick={handleEnhanceDescription} size="sm" variant="ghost" disabled={isEnhancing}>
                    {isEnhancing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    เพิ่มด้วย AI
                 </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEnhancing ? <Skeleton className="h-24 w-full" /> : <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>}
            </CardContent>
          </Card>

          {amulet.auctionType === 'up-bid' && <PriceHistoryChart />}
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center"><BookOpen className="mr-3 h-6 w-6" />ประวัติ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{amulet.history}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center justify-between">
                <div className="flex items-center">
                  <Wand className="mr-3 h-6 w-6" />
                  <span>เคล็ดลับการดูแลด้วย AI</span>
                </div>
                {!careTips && (
                  <Button onClick={handleGetCareTips} size="sm" variant="ghost" disabled={isGettingTips}>
                     {isGettingTips ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    รับเคล็ดลับ
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGettingTips ? (
                <Skeleton className="h-20 w-full" />
              ) : careTips ? (
                 <p className="text-muted-foreground whitespace-pre-wrap">{careTips}</p>
              ) : (
                <p className="text-muted-foreground italic">คลิกปุ่มเพื่อสร้างเคล็ดลับการดูแลส่วนบุคคลด้วย AI</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
