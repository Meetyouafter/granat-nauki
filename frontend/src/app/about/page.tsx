import Section from '../../components/Section';
import styles from './page.module.scss';

export default async function AboutPage() {
  return (
    <main>
      <Section title="Обо мне" lead="Коротко о квалификации и подходе.">
        <div className={styles.content}>
          <p>Практикующий психолог, больше 5 лет опыта. Работаю в гуманистическом и когнитивно-поведенческом подходах.</p>
          <p>Помогаю справляться с тревогой, выгоранием, сложностями в отношениях и самооценкой.</p>
          <ul>
            <li>Высшее психологическое образование</li>
            <li>Супервизия и личная терапия</li>
            <li>Регулярное обучение и повышение квалификации</li>
          </ul>
        </div>
      </Section>
    </main>
  );
}


