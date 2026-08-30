// lib/youtube/get-channel.ts — Opdatering — logger fulde fejlbesked fra YouTube API ved fejl
export async function getYoutubeChannel(accessToken: string) {
  const response = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&mine=true",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Kunne ikke hente YouTube-kanal: ${response.status} — ${body}`);
  }

  const data = await response.json();
  const channel = data.items?.[0];

  if (!channel) {
    return null;
  }

  return {
    youtubeChannelId: channel.id as string,
    channelTitle: channel.snippet.title as string,
    uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads as string,
  };
}
