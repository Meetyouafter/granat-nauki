'use client';

import type { FC } from 'react';

import Section from '@/components/Section/Section';

interface IError {
  error: Error;
  reset: () => void;
}

const Error: FC<IError> = ({ error, reset }) => {
  return (
    <Section>
      <p>{error.message}</p>
      <button onClick={() => { reset(); }}>Повторить</button>
    </Section>
  );
};

export default Error;
