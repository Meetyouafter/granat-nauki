'use client';

import Section from "@/components/Section/Section";
import { FC } from "react";

interface IError {
  error: Error;
  reset: () => void;
}

const Error: FC<IError> = ({ error, reset }) => {
  return (
    <Section>
      <h2>Ошибка загрузки FAQ</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Повторить</button>
    </Section>
  );
};

export default Error;
