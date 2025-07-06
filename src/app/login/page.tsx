"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User, ShieldQuestion } from 'lucide-react';
import type { User as UserType } from '@/lib/types';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (user: UserType) => {
    localStorage.setItem('amulet-user', JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));
    router.push('/');
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const appUser: UserType = {
        uid: user.uid,
        name: user.displayName || 'ผู้ศรัทธา',
        email: user.email || '',
        avatar: user.photoURL || `https://placehold.co/40x40.png`,
      };
      handleLogin(appUser);
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: `ยินดีต้อนรับ, ${appUser.name}!`,
      });
    } catch (error) {
      console.error("Authentication Error:", error);
      toast({
        title: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
        description: "ไม่สามารถเข้าสู่ระบบด้วย Google ได้ในขณะนี้ โปรดลองอีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const handleAnonymousLogin = () => {
    // Note: Firebase anonymous sign-in would be implemented here
    // For now, we use a mock anonymous user
    const anonymousUser: UserType = {
      uid: `anon-${Date.now()}`,
      name: 'ผู้แสวงหาที่ไม่ระบุชื่อ',
    }
    handleLogin(anonymousUser);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">ยินดีต้อนรับกลับ</CardTitle>
          <CardDescription>
            เลือกเส้นทางสู่การตรัสรู้ของคุณ
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={handleGoogleLogin} className="w-full">
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.5l-62.7 62.7C337 97.2 295.6 80 248 80c-82.8 0-150.5 67.7-150.5 150.5S165.2 406.5 248 406.5c70.4 0 120.3-31.5 120.3-86.6H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            ลงชื่อเข้าใช้ด้วย Google
          </Button>
          <Button onClick={handleAnonymousLogin} variant="secondary" className="w-full">
            <ShieldQuestion className="mr-2 h-4 w-4" />
            ดำเนินการต่อโดยไม่ระบุชื่อ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
