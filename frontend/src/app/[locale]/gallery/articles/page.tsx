import fs from 'fs/promises';
import path from 'path';
import Image from 'next/image';
import Section from '../../../../components/Section';
import Container from '../../../../components/Container';
import styles from './page.module.scss';

async function readPublicImages(subdir: string): Promise<{ src: string; alt: string }[]> {
  const dirPath = path.join(process.cwd(), 'public', 'images', subdir);
  let fileNames: string[] = [];
  try {
    fileNames = await fs.readdir(dirPath);
  } catch {
    return [];
  }
  const allowed = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
  return fileNames
    .filter((name) => allowed.has(path.extname(name).toLowerCase()))
    .map((name) => ({ src: `/images/${subdir}/${name}`, alt: name }));
}

export default async function ArticlesGalleryPage() {
  const images = await readPublicImages('articles');
  return (
    <main>
      <Section title="Галерея статей" lead="Изображения из public/images/articles">
        <Container>
          {images.length === 0 ? (
            <p className={styles.caption}>Пока нет изображений. Добавьте файлы в public/images/articles</p>
          ) : (
            <div className={styles.grid}>
              {images.map((img) => (
                <figure key={img.src} className={styles.item}>
                  <Image src={img.src} alt={img.alt} width={600} height={400} className={styles.image} />
                  <figcaption className={styles.caption}>{img.alt}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}


