"use client";

// app/login/login-button.tsx — Ny fil — knap der starter Google OAuth-login via Supabase
import { createClient } from "@/lib/supabase/client";

export default function LoginButton() {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes:
          "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  return <button onClick={handleLogin}>Log ind med Google</button>;
}
