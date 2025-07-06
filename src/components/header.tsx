import Link from 'next/link';
import { Logo } from '@/components/logo';
import HeaderActions from '@/components/header-actions';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="animate-logo-enter" />
            <span className="font-bold font-headline hidden sm:inline-block">
              BuchaPhra.com
            </span>
          </Link>
        </div>
        <HeaderActions />
      </div>
    </header>
  );
}
