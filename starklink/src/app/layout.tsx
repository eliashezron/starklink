// src/app/layout.tsx
import "./globals.css";
import SessionWrapper from "../components/SessionWrapper";
import { StarknetProvider } from "./context/starknet-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <StarknetProvider>
          <SessionWrapper>{children}</SessionWrapper>
        </StarknetProvider>
      </body>
    </html>
  );
}
