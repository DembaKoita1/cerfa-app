// app/login/layout.tsx

export const metadata = {
  title: 'Connexion - AutoCERFA',
  description: 'Connexion à AutoCERFA',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-white min-h-screen flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}
