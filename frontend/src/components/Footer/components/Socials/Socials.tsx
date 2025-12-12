import Image from 'next/image';
import { socialLinks } from '@/constants';

import styles from './Socials.module.scss';

const Socials = () => {
  return (
    <div className={styles.root}>
      <a href={socialLinks.telegram} className={styles.link} target="_blank" rel="noreferrer">
        <Image src="/icons/socials/tg.svg" alt="Telegram" width={32} height={32} />
      </a>
      <a href={socialLinks.instagram} className={styles.link} target="_blank" rel="noreferrer">
        <Image src="/icons/socials/ig.svg" alt="Instagram" width={32} height={32} />
      </a>
    </div>
  );
};

export default Socials;