import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "OWON Todo 应用",
  description: "一个简单高效的待办事项管理工具",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased bg-background min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main >
            <div className="w-full" id="main-content">
              {children}
            </div>
            {/* <header className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-2">OWON Todo</h1>
              <p className="text-muted-foreground">管理你的每日任务</p>
            </header> */}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
