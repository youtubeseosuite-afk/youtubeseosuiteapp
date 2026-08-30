// app/auth/callback/route.ts — Opdatering — gemmer YouTube-kanal og refresh token efter Google-login
import { createClient } from "@/lib/supabase/server";
import { getYoutubeChannel } from "@/lib/youtube/get-channel";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session?.provider_token && data.user) {
      const channelInfo = await getYoutubeChannel(data.session.provider_token);

      if (channelInfo) {
        await supabase.from("channels").upsert(
          {
            user_id: data.user.id,
            youtube_channel_id: channelInfo.youtubeChannelId,
            channel_title: channelInfo.channelTitle,
            provider_refresh_token: data.session.provider_refresh_token,
          },
          { onConflict: "user_id,youtube_channel_id" }
        );
      }
    }
  }

  return NextResponse.redirect(`${origin}/`);
}
