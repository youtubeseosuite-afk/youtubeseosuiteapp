// lib/google/refresh-access-token.ts — Ny fil — henter et nyt Google access token via refresh_token
export async function refreshGoogleAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`Kunne ikke forny Google access token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token as string;
}
