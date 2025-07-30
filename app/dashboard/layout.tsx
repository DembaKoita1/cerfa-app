import 'app/global.css';
import React from 'react';
import Image from 'next/image';
import LogoutButton from 'components/logoutButton';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

   return (
    <html lang="fr">
      <body className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white text-black p-6 flex flex-col justify-between shadow-md">
          <div>
            {/* ✅ Logo */}
            <div className="mb-8 flex flex-col items-center">
              <Image
                src="/logokoutquekout.png"
                alt="Logo AutoCERFA"
                width={300}
                height={100}
                className="rounded-full mb-2"
              />
              <p className="text-xs text-gray-500 text-center">Auto CERFA</p>
            </div>

            {/* ✅ Navigation */}
            <nav className="space-y-4">
              <a href="/dashboard" className="block bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                Accueil
              </a>
              <a href="/dashboard/ajouter" className="block bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                Ajouter
              </a>
              <a href="/dashboard/liste" className="block bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                Liste
              </a>
              <a href="/dashboard/modifier" className="block bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                Modifier
              </a>
              <a href="/dashboard/supprimer" className="block bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                Supprimer
              </a>
            </nav>
          </div>

          {/* Footer bouton Déconnexion */}
          <div className="mt-8">
            <LogoutButton />
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </body>
    </html>
  );
}