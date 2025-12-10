"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    // Check if user has a valid session (from the reset password callback)
    async function checkSession() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        const urlError = searchParams.get("error");
        if (urlError === "invalid_token") {
          setError("Geçersiz veya süresi dolmuş reset linki. Lütfen yeni bir şifre sıfırlama isteği gönderin.");
        } else {
          setError("Geçersiz veya eksik reset linki. Lütfen yeni bir şifre sıfırlama isteği gönderin.");
        }
      }
      setIsCheckingSession(false);
    }

    checkSession();
  }, [supabase, searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor!");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır!");
      return;
    }

    setIsLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setIsLoading(false);

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-lg border p-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !password) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-lg border p-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-red-600">
              Hata
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error}
            </p>
          </div>
          <div className="text-center">
            <Button
              as={Link}
              href="/forgot-password"
              color="primary"
              className="w-full"
            >
              Yeni Şifre Sıfırlama İsteği Gönder
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold">
            Yeni Şifre Belirle
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Yeni şifrenizi belirleyin
          </p>
        </div>

        {isSuccess ? (
          <div className="mt-8 space-y-6">
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">
                Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <form className="space-y-4" onSubmit={handleResetPassword}>
              {error && (
                <div className="rounded-md bg-red-50 p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Yeni Şifre
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
                Şifreyi Güncelle
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
