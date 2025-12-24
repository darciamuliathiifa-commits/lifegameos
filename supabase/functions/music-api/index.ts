import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Free lofi music streams and tracks
const lofiTracks = [
  {
    id: '1',
    title: 'Lofi Focus Beat',
    artist: 'Chill Beats',
    duration: '3:45',
    // Using free CC0 licensed music from various sources
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  },
  {
    id: '2',
    title: 'Study Session',
    artist: 'Lo-Fi Dreams',
    duration: '4:12',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946ae4be0a.mp3',
  },
  {
    id: '3',
    title: 'Deep Work',
    artist: 'Focus Music',
    duration: '3:58',
    url: 'https://cdn.pixabay.com/download/audio/2023/05/31/audio_25a0a24f58.mp3',
  },
  {
    id: '4',
    title: 'Calm Vibes',
    artist: 'Ambient Zone',
    duration: '4:30',
    url: 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3',
  },
  {
    id: '5',
    title: 'Night Coding',
    artist: 'Pixel Dreams',
    duration: '5:15',
    url: 'https://cdn.pixabay.com/download/audio/2023/09/25/audio_4d25e3caa7.mp3',
  },
  {
    id: '6',
    title: 'Peaceful Mind',
    artist: 'Zen Beats',
    duration: '3:22',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3',
  },
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, trackId } = await req.json();

    console.log('Music API request:', { action, trackId });

    if (action === 'list') {
      // Return list of available tracks
      return new Response(
        JSON.stringify({ 
          success: true, 
          tracks: lofiTracks.map(t => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            duration: t.duration,
          }))
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get' && trackId) {
      // Return specific track with URL
      const track = lofiTracks.find(t => t.id === trackId);
      if (track) {
        return new Response(
          JSON.stringify({ success: true, track }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, error: 'Track not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (action === 'random') {
      // Return a random track
      const randomTrack = lofiTracks[Math.floor(Math.random() * lofiTracks.length)];
      return new Response(
        JSON.stringify({ success: true, track: randomTrack }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Music API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
