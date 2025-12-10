"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    if (password.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır!");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/login`,
      },
    });

    if (error) {
      alert(error.message);
      setIsLoading(false);
      return;
    }

    alert("Kayıt başarılı! Lütfen e-postanızı kontrol edin ve e-posta doğrulama linkine tıklayın.");
    setIsLoading(false);
    // Optionally redirect to login page
    // router.push("/login");
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/login`,
      },
    });

    if (error) {
      alert(error.message);
      setIsGoogleLoading(false);
    }
    // Note: User will be redirected to Google, so we don't set loading to false here
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold">
            Kayıt Ol
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary-600">
              Giriş yap
            </Link>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full rounded-md border px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                En az 6 karakter olmalıdır
              </p>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full rounded-md border px-3 py-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Kayıt Ol
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
