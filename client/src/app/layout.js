import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderAuth from "./_components/sessionProviderAuth";
import NavBar from "./_components/navbar";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Youtube",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionProviderAuth>
        <body className={inter.className}>
          <NavBar />
          {children}
        </body>
      </SessionProviderAuth>
    </html>
  );
}
