// app/auth/callback/route.ts — Opdatering — logger hvert trin for at finde fejlen i kanal-gem
import { createClient } from "@/lib/supabase/server";
import { getYoutubeChannel } from "@/lib/youtube/get-channel";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("exchangeCodeForSession fejl:", error.message);
    }

    console.log("provider_token findes:", !!data.session?.provider_token);
    console.log(
      "provider_refresh_token findes:",
      !!data.session?.provider_refresh_token
    );

    if (data.session?.provider_token && data.user) {
      try {
        const channelInfo = await getYoutubeChannel(data.session.provider_token);
        console.log("channelInfo:", channelInfo);

        if (channelInfo) {
          const { error: upsertError } = await supabase.from("channels").upsert(
            {
              user_id: data.user.id,
              youtube_channel_id: channelInfo.youtubeChannelId,
              channel_title: channelInfo.channelTitle,
              provider_refresh_token: data.session.provider_refresh_token,
            },
            { onConflict: "user_id,youtube_channel_id" }
          );

          if (upsertError) {
            console.error("Fejl ved gem af kanal:", upsertError.message);
          }
        }
      } catch (err) {
        console.error("Fejl ved hentning af YouTube-kanal:", err);
      }
    }
  }

  return NextResponse.redirect(`${origin}/`);
}
