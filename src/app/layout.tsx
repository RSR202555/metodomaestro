import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AULA MAESTRO - A ELITE DO PERSONAL TRAINER",
  description: "A mentoria presencial definitiva para escalar seu faturamento e dominar a autoridade no mercado de alto padrão.",
  keywords: ["personal trainer", "mentoria", "aula maestro", "faturamento personal", "vendas fitness"],
  icons: {
    icon: "/imagens/logo.jpeg",
    shortcut: "/imagens/logo.jpeg",
    apple: "/imagens/logo.jpeg",
  },
  openGraph: {
    title: "AULA MAESTRO - A ELITE DO PERSONAL TRAINER",
    description: "Escale seu faturamento e domine o mercado de alto padrão.",
    type: "website",
    images: ["/imagens/logo.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/imagens/logo.jpeg" type="image/jpeg" />
        <link rel="shortcut icon" href="/imagens/logo.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/imagens/logo.jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-background text-on-background font-sans antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}
