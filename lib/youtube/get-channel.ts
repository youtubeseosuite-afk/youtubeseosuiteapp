// lib/youtube/get-channel.ts — Ny fil — henter brugerens YouTube-kanal via Data API
export async function getYoutubeChannel(accessToken: string) {
  const response = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&mine=true",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error(`Kunne ikke hente YouTube-kanal: ${response.status}`);
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
