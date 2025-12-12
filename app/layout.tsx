import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { FloatingChatButton } from "@/components/common/FloatingChatButton";

export const metadata: Metadata = {
  title: "FinFolio - AI 기반 금융 학습 플랫폼",
  description: "뉴스 하이라이팅부터 AI 튜터까지, 나만의 금융 지식 포트폴리오",
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
