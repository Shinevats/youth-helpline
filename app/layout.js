import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['300','400','500','600','700','800','900'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['300','400','500','600','700'] });

export const metadata = {
  title: 'SafeSpace India — You Are Not Alone',
  description: 'A safe, anonymous platform for Indian teenagers to find support, resources, and community when facing anxiety, depression, harassment, academic burnout, and more.',
  keywords: 'teen mental health India, youth helpline India, student depression support, school harassment help, anonymous teen support',
  openGraph: {
    title: 'SafeSpace India',
    description: 'A safe space for teens to share, heal, and grow.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0d9488" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('safespace-theme');
                  var p = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.setAttribute('data-theme', t || (p ? 'dark' : 'light'));
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${outfit.variable} ${inter.variable}`}>
        <ThemeProvider>
          <UserProvider>
            <div className="emergency-banner">
              🆘 In immediate danger? Call <a href="tel:1098">CHILDLINE 1098</a> or{' '}
              <a href="tel:9820466627">AASRA 9820466627</a> — free, 24/7, confidential
            </div>
            <Navbar />
            <main>{children}</main>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
