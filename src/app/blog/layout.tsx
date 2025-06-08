import ThemeToggle from '../_components/ThemeToggle';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeToggle />
      {children}
    </>
  );
}
