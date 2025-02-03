'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export default function LanguageSelector() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('navigation');

  const switchLanguage = (newLocale: string) => {
    startTransition(() => {
      router.replace(`/${newLocale}${pathname}`);
    });
  };

  return (
    <div className="relative inline-block text-left">
      <select
        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
        value={locale}
        onChange={(e) => switchLanguage(e.target.value)}
        disabled={isPending}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
      {isPending && (
        <div className="absolute right-2 top-2">
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-red-500" />
        </div>
      )}
    </div>
  );
} 