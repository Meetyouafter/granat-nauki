import type { FC, PropsWithChildren } from 'react';

import cns from 'classnames';

import Container from '@components/Container/Container';

import styles from './Section.module.scss';

interface ISection {
  id?: string;
  title?: string;
  lead?: string;
  pageTitle?: boolean;
  className?: string | undefined;
};

const Section: FC<PropsWithChildren<ISection>> = ({
  id,
  title,
  lead,
  pageTitle = false,
  className,
  children,
}) => {
  const Heading = pageTitle ? 'h1' : 'h2';

  return (
    <section id={id} className={cns(styles.section, className)}>
      <Container>
        {title && <Heading className={styles.title}>{title}</Heading>}
        {lead && <p className={styles.lead}>{lead}</p>}
        {children}
      </Container>
    </section>
  );
};

export default Section;
