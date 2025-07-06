"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Wand2, Image as ImageIcon, Video, View, CalendarDays, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "@/lib/types";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(3, "ชื่อต้องมีอย่างน้อย 3 ตัวอักษร"),
  description: z.string().min(10, "คำอธิบายต้องมีอย่างน้อย 10 ตัวอักษร"),
  imageUrls: z.string().min(1, "กรุณาใส่ URL รูปภาพอย่างน้อยหนึ่งรายการ"),
  videoUrl: z.string().url("กรุณาป้อน URL ของวิดีโอ YouTube ที่ถูกต้อง").optional().or(z.literal('')),
  model_3d_url: z.string().url("กรุณาป้อน URL ของโมเดล 3D ที่ถูกต้อง").optional().or(z.literal('')),
  material: z.string().min(2, "กรุณาระบุวัสดุ"),
  history: z.string().min(10, "ประวัติต้องมีอย่างน้อย 10 ตัวอักษร"),
  auctionType: z.enum(["fixed", "up-bid", "down-bid"]),
  price: z.coerce.number().positive("ราคาต้องเป็นตัวเลขบวก"),
  minBidIncrement: z.coerce.number().optional(),
  auctionStartTime: z.string().optional(),
  auctionEndTime: z.string().optional(),
})
.refine(data => {
    if (data.auctionType === 'up-bid' && (!data.minBidIncrement || data.minBidIncrement <= 0)) {
        return false;
    }
    return true;
}, {
    message: "กรุณาระบุราคาประมูลขั้นต่ำที่เป็นบวก",
    path: ["minBidIncrement"],
})
.refine(data => {
    if (data.auctionType !== 'fixed') {
        return !!data.auctionStartTime && !!data.auctionEndTime;
    }
    return true;
}, {
    message: "กรุณาระบุวันเริ่มต้นและสิ้นสุดการประมูล",
    path: ["auctionEndTime"],
})
.refine(data => {
    if (data.auctionType !== 'fixed' && data.auctionStartTime && data.auctionEndTime) {
        return new Date(data.auctionStartTime) < new Date(data.auctionEndTime);
    }
    return true;
}, {
    message: "วันสิ้นสุดต้องอยู่หลังวันเริ่มต้น",
    path: ["auctionEndTime"],
});

export default function AmuletListingForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrls: "",
      videoUrl: "",
      model_3d_url: "",
      material: "",
      history: "",
      auctionType: "fixed",
      price: 0,
    },
  });

  const auctionType = form.watch("auctionType");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const userJson = localStorage.getItem('amulet-user');
    if (!userJson) {
      toast({
        title: "จำเป็นต้องเข้าสู่ระบบ",
        description: "กรุณาเข้าสู่ระบบก่อนลงประกาศพระเครื่อง",
        variant: "destructive",
      });
      router.push('/login');
      setIsSubmitting(false);
      return;
    }
    const currentUser: User = JSON.parse(userJson);

    try {
      const newAmuletData = {
        name: values.name,
        description: values.description,
        imageUrls: values.imageUrls.split(',').map(url => url.trim()).filter(url => url),
        videoUrl: values.videoUrl || '',
        model_3d_url: values.model_3d_url || '',
        material: values.material,
        history: values.history,
        auctionType: values.auctionType,
        currentPrice: values.price,
        worshipCount: 0,
        userId: currentUser.uid,
        userName: currentUser.name || "ผู้ไม่ประสงค์ออกนาม",
        timestamp: serverTimestamp(),
        auctionEndTime: values.auctionEndTime ? new Date(values.auctionEndTime) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days if not set
        ...(values.auctionType === 'fixed' && { fixedPrice: values.price }),
        ...(values.auctionType !== 'fixed' && { 
            startPrice: values.price,
            auctionStartTime: values.auctionStartTime ? new Date(values.auctionStartTime) : new Date(), // Default now if not set
        }),
        ...(values.auctionType === 'up-bid' && { minBidIncrement: values.minBidIncrement || 0 }),
      };

      const docRef = await addDoc(collection(db, "amulets"), newAmuletData);
      
      toast({
        title: "ลงประกาศสำเร็จ!",
        description: `พระเครื่อง "${values.name}" ของคุณได้ถูกลงประกาศแล้ว`,
      });
      router.push(`/amulets/${docRef.id}`);

    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลงประกาศพระเครื่องได้ในขณะนี้ โปรดลองอีกครั้ง",
        variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">ลงประกาศพระเครื่อง</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อพระเครื่อง</FormLabel>
                    <FormControl>
                      <Input placeholder="เช่น พระสมเด็จวัดระฆัง" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>คำอธิบาย</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="บอกเล่าเรื่องราวและพุทธคุณของพระเครื่อง" {...field} />
                    </FormControl>
                    <Button type="button" variant="ghost" size="sm" className="mt-2">
                        <Sparkles className="mr-2 h-4 w-4" />
                        เพิ่มประสิทธิภาพด้วย AI
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline flex items-center"><ImageIcon className="mr-2 h-5 w-5"/>สื่อมัลติมีเดีย</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="imageUrls"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL รูปภาพ</FormLabel>
                        <FormControl>
                          <Textarea placeholder="https://... (คั่นแต่ละ URL ด้วยลูกน้ำ ,)" {...field} />
                        </FormControl>
                        <FormDescription>
                          ใส่ URL ของรูปภาพ คั่นด้วยเครื่องหมายลูกน้ำ (,) เพื่อเพิ่มหลายรูป
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Video className="mr-2 h-4 w-4"/>URL วิดีโอ YouTube (ถ้ามี)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model_3d_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><View className="mr-2 h-4 w-4"/>URL โมเดล 3 มิติ (ถ้ามี)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://sketchfab.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>วัสดุ</FormLabel>
                      <FormControl>
                        <Input placeholder="เช่น เนื้อผง, โลหะ, ดิน" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="history"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>ประวัติ</FormLabel>
                      <FormControl>
                      <Textarea placeholder="เช่น สร้างปี พ.ศ. 2500 โดย..." {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />

              <Button type="button" variant="outline" className="w-full">
                <Wand2 className="mr-2 h-4 w-4" />
                วิเคราะห์ประวัติและราคาประเมินด้วย AI (เร็วๆ นี้)
              </Button>

              <FormField
                control={form.control}
                name="auctionType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>ประเภทการขาย</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col md:flex-row gap-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="fixed" />
                          </FormControl>
                          <FormLabel className="font-normal">ราคาคงที่</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="up-bid" />
                          </FormControl>
                          <FormLabel className="font-normal">ประมูล (ราคาขึ้น)</FormLabel>
                        </FormItem>
                         <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="down-bid" />
                          </FormControl>
                          <FormLabel className="font-normal">ประมูล (ราคาลง)</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {auctionType === 'fixed' && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ราคาขาย (บาท)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {auctionType !== 'fixed' && (
                <Card>
                  <CardHeader>
                      <CardTitle className="text-xl font-headline flex items-center"><CalendarDays className="mr-2 h-5 w-5"/>กำหนดเวลาและราคาประมูล</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="auctionStartTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>วันเริ่มต้นประมูล</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="auctionEndTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>วันสิ้นสุดประมูล</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {auctionType === 'up-bid' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ราคาเริ่มต้น (บาท)</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="3000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <FormField
                            control={form.control}
                            name="minBidIncrement"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>เสนอราคาขั้นต่ำ (บาท)</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="100" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      </div>
                    )}
                    {auctionType === 'down-bid' && (
                       <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ราคาเริ่มต้น (บาท)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="10000" {...field} />
                            </FormControl>
                            <FormDescription>ราคาจะลดลงเรื่อยๆ จนกว่าจะมีคนซื้อ</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "กำลังบันทึก..." : "ลงประกาศพระเครื่อง"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
