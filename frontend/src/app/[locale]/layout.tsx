type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};
 
export default async function LocaleLayout({children, params}: Props) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;

 
  return (
    <html lang={locale}>
      <body>
        {children}
      </body>
    </html>
  );
}