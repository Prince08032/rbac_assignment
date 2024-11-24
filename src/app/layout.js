import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <main className="flex-1 lg:ml-64 p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
