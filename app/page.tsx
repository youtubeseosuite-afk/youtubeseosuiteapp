// app/page.tsx — Ny fil — forside, viser login-knap eller velkomst afhængig af login-status
import { createClient } from "@/lib/supabase/server";
import LoginButton from "./login/login-button";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main>
        <h1>YouTube SEO & Community Growth Tool</h1>
        <LoginButton />
      </main>
    );
  }

  return (
    <main>
      <h1>Velkommen, {user.user_metadata.full_name ?? user.email}</h1>
    </main>
  );
}
