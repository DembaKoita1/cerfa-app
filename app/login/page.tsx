'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Connexion réussie !');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
      <Image
        src="/logokoutquekout.png"
        alt="Logo AutoCERFA"
        width={300}
        height={100}
        className="rounded-full mb-8"
      />

      <form onSubmit={handleSubmit} className="w-96">
        <div className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="email@domain.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full h-10 px-4 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-200 text-zinc-500 text-xl font-medium font-['Inter'] leading-loose"
            required
          />
          <input
            type="password"
            placeholder="mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full h-10 px-4 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-200 text-zinc-500 text-xl font-medium font-['Inter'] leading-loose"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 px-4 bg-green-400 rounded-lg text-white text-base font-medium font-['Inter'] leading-normal disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Connexion'}
          </button>
        </div>

        <div className="flex items-center gap-2 my-6">
          <div className="flex-1 h-px bg-neutral-200" />
          <div className="text-center text-zinc-500 text-base font-normal font-['Inter'] leading-normal">
            Inscrit toi
          </div>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        <div className="h-10 bg-zinc-100 rounded-lg flex justify-center items-center cursor-pointer">
          <div className="text-black text-base font-medium font-['Inter'] leading-normal">
            Créer un compte
          </div>
        </div>

        <div className="mt-6 text-center text-zinc-500 text-base font-normal font-['Inter'] leading-normal">
          By clicking continue, you agree to our{' '}
          <span className="text-black">Terms of Service</span> and{' '}
          <span className="text-black">Privacy Policy</span>
        </div>
      </form>
    </div>
  );
}
