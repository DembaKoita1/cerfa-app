'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // ou la route que tu souhaites après déconnexion
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-2xl text-gray-500 hover:text-black flex items-center gap-2"
      aria-label="Déconnexion"
    >
      ↩️ Déconnexion
    </button>
  );
}
