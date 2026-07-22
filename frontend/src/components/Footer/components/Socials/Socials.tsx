import type { FC } from 'react';
import Image from 'next/image';
import { contacts, socialLinks } from '@constants';

import styles from './Socials.module.scss';

interface ISocials {
  title?: string;
}

const Socials: FC<ISocials> = ({ title }) => {
  return (
    <div className={styles.root} aria-label={title}>
      <a href={socialLinks.telegram} className={styles.link} target="_blank" rel="noreferrer">
        <Image src="/icons/socials/tg.svg" alt="Telegram" width={32} height={32} />
      </a>
      <a href={socialLinks.instagram} className={styles.link} target="_blank" rel="noreferrer">
        <Image src="/icons/socials/ig.svg" alt="Instagram" width={32} height={32} />
      </a>
      <a href={contacts.whatsapp} className={styles.link} target="_blank" rel="noreferrer">
        <Image src="/icons/socials/wa.svg" alt="WhatsApp" width={32} height={32} />
      </a>
    </div>
  );
};

export default Socials;