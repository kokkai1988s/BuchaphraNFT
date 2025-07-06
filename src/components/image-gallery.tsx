"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

interface ImageGalleryProps {
  imageUrls: string[]
  alt: string
}

export default function ImageGallery({ imageUrls, alt }: ImageGalleryProps) {
  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="w-full max-w-md aspect-square rounded-lg overflow-hidden shadow-2xl bg-card flex items-center justify-center">
        <p className="text-muted-foreground">ไม่มีรูปภาพ</p>
      </div>
    )
  }

  return (
    <Carousel className="w-full max-w-md">
      <CarouselContent>
        {imageUrls.map((url, index) => (
          <CarouselItem key={index}>
              <Card className="overflow-hidden border-2 border-primary/20">
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  <Image
                    src={url}
                    alt={`${alt} - รูปที่ ${index + 1}`}
                    width={600}
                    height={600}
                    className="object-cover w-full h-full"
                    priority={index === 0}
                  />
                </CardContent>
              </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden sm:block">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  )
}
