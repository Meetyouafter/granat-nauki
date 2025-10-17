'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    // Обновляем URL с новым языком
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      zIndex: 1000,
      display: 'flex',
      gap: '10px'
    }}>
      <button
        onClick={() => switchLanguage('ru')}
        style={{
          padding: '8px 16px',
          backgroundColor: locale === 'ru' ? '#0070f3' : '#f0f0f0',
          color: locale === 'ru' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        RU
      </button>
      <button
        onClick={() => switchLanguage('en')}
        style={{
          padding: '8px 16px',
          backgroundColor: locale === 'en' ? '#0070f3' : '#f0f0f0',
          color: locale === 'en' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        EN
      </button>
    </div>
  );
}

