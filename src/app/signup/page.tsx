"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        router.push("/api/auth/success");
      }
    } catch (error: any) {
      setError(error.message || "Kayıt olurken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Kayıt Ol</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block mb-2">
              Ad
            </label>
            <input
              id="firstName"
              type="text"
              
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-2">
              Soyad
            </label>
            <input
              id="lastName"
              type="text"
              
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-2 border rounded"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isDisabled={loading}
          >
            Kayıt Ol
          </Button>
        </form>
        <p className="mt-4 text-center">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="text-blue-600">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}

