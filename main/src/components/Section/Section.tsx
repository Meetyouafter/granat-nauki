import type { FC, PropsWithChildren } from 'react';

import Container from '@components/Container/Container';

import styles from './Section.module.scss';

interface ISection {
  id?: string;
  title?: string;
  lead?: string;
};

const Section: FC<PropsWithChildren<ISection>> = ({ id, title, lead, children }) => (
  <section id={id} className={styles.section}>
    <Container>
      {title && <h2 className={styles.title}>{title}</h2>}
      {lead && <p className={styles.lead}>{lead}</p>}
      {children}
    </Container>
  </section>
);

export default Section;
