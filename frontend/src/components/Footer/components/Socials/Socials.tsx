import Image from 'next/image';
import { socialLinks } from '@/constants';

import styles from './Socials.module.scss';

export default async function Socials() {
  return (
    <div className={styles.root}>
      <a href={socialLinks.telegram} className={styles.link} target="_blank" rel="noreferrer">
        <Image src="/icons/telegram.svg" alt="Telegram" width={40} height={40} />
      </a>
      <a href={socialLinks.instagram} className={styles.link} target="_blank" rel="noreferrer">
        <Image src="/icons/instagram.svg" alt="Instagram" width={40} height={40} />
      </a>
    </div>
  );
}


