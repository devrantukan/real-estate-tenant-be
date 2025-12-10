"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      alert(error.message);
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold">
            Şifremi Unuttum
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            E-posta adresinize şifre sıfırlama linki göndereceğiz
          </p>
        </div>

        {isSuccess ? (
          <div className="mt-8 space-y-6">
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">
                Şifre sıfırlama linki e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                as={Link}
                href="/login"
                color="primary"
                className="w-full"
              >
                Giriş Sayfasına Dön
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <form className="space-y-4" onSubmit={handleResetPassword}>
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
                  placeholder="ornek@email.com"
                />
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                Şifre Sıfırlama Linki Gönder
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm font-medium text-primary hover:text-primary-600"
              >
                ← Giriş sayfasına dön
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
