
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'adam@apogeeintelligence.ai' && password === 'P@ssword123!') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'adam@apogeeintelligence.ai',
        password: 'P@ssword123!'
      });
      if (!error) router.push('/');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 p-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
