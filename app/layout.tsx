import '../styles/globals.css';
import ChatWidget from '../components/ChatWidget';

export const metadata = {
  title: 'SecComply — Compliance Automation Simplified',
  description: 'Automate compliance across 50+ frameworks with AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=Manrope:wght@700;800;900&family=Inter:wght@400;500;600&family=DM+Sans:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
  </head>
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
