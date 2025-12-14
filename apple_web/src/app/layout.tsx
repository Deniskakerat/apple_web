import "./globals.css";

export const metadata = {
  title: "Платформа продажу саджанців",
  description: "Онлайн-магазин плодових саджанців",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
