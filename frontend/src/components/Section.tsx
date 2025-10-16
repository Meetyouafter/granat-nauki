import type { ReactNode } from 'react';
import Container from './Container';
import styles from './Section.module.scss';

type Props = {
  id?: string;
  title?: string;
  lead?: string;
  children?: ReactNode;
};

export default function Section({ id, title, lead, children }: Props) {
  return (
    <section id={id} className={styles.section}>
      <Container>
        {title && <h2 className={styles.title}>{title}</h2>}
        {lead && <p className={styles.lead}>{lead}</p>}
        {children}
      </Container>
    </section>
  );
}


