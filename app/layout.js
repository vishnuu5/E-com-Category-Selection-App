import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "E-commerce Auth App",
  description:
    "Simple e-commerce with user authentication and category selection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-3">{children}</main>
      </body>
    </html>
  );
}
