import "./globals.css";

export const metadata = {
  title: "PokeCollector",
  description: "Pokemon Collection App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
