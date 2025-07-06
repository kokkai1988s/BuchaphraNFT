import { amulets } from '@/lib/data';
import { notFound } from 'next/navigation';
import AmuletDetailsClient from '@/components/amulet-details-client';
import type { Amulet } from '@/lib/types';

export async function generateStaticParams() {
  return amulets.map((amulet) => ({
    id: amulet.id,
  }));
}

export default function AmuletPage({ params }: { params: { id: string } }) {
  const amulet = amulets.find((a) => a.id === params.id) as Amulet | undefined;

  if (!amulet) {
    notFound();
  }

  return <AmuletDetailsClient amulet={amulet} />;
}
