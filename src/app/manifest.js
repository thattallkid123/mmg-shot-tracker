export default function manifest() {
  return {
    name: 'Mr Mallorca Golf Shot Tracker',
    short_name: 'MMG Tracker',
    description:
      'Mallorca-first golf tracker for custom hole maps, GPS shots, stats, and handicap history.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f4ef',
    theme_color: '#2d4a3e',
    icons: [
      {
        src: '/MMG_Logo_Green_Transparent.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
