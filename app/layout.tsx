import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { FloatingChatButton } from "@/components/common/FloatingChatButton";

export const metadata: Metadata = {
  title: "InsightStock - AI 기반 금융 학습 플랫폼",
  description: "초보 투자자를 위한 AI 기반 금융 학습 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          {children}
          <FloatingChatButton />
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
