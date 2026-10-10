import autoprefixer from 'autoprefixer';

// Вендорные префиксы (-webkit- и т. п.) добавляются при сборке, в SCSS их не пишем.
export default {
  plugins: [autoprefixer()],
};
