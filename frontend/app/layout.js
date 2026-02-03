import "./globals.css";
import AppProviders from "../components/layout/AppProviders";

export const metadata = {
  title: "Healthcare Management System",
  description: "Final Year Project - Healthcare Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

