import Image from 'next/image';
import Link from 'next/link';
import type { Amulet } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from './ui/badge';
import { Heart, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface AmuletCardProps {
  amulet: Amulet;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const getAuctionTypeText = (type: Amulet['auctionType']) => {
    switch (type) {
        case 'fixed': return 'ราคาคงที่';
        case 'up-bid': return 'ประมูลขึ้น';
        case 'down-bid': return 'ประมูลลง';
        default: return 'ประมูล';
    }
}

export function AmuletCard({ amulet }: AmuletCardProps) {
  return (
    <motion.div variants={cardVariants}>
      <Link href={`/amulets/${amulet.id}`} className="group">
        <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 border-2 border-transparent hover:border-primary/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-0">
            <div className="aspect-square overflow-hidden">
              <Image
                src={amulet.imageUrls[0]}
                alt={`Image of ${amulet.name}`}
                width={400}
                height={400}
                className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                data-ai-hint={amulet.dataAiHint}
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 pb-2">
            <CardTitle className="font-headline text-xl leading-tight truncate">
              {amulet.name}
            </CardTitle>
            <p className="font-semibold text-lg mt-2 text-primary">
              {amulet.currentPrice.toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 })}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
            <Badge variant={amulet.auctionType === 'fixed' ? 'default' : 'secondary'} className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {getAuctionTypeText(amulet.auctionType)}
            </Badge>
            <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-red-500/80" />
                <span>{amulet.worshipCount}</span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
