import React from 'react'
import videojs from 'video.js'
import Player from '~/components/video-player'

export default function Home({ mime }) {
  const playerRef = React.useRef(null)

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: 'stream',
        type: 'video/webm',
      },
    ],
  }

  const handlePlayerReady = (player) => {
    playerRef.current = player

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting')
    })

    player.on('dispose', () => {
      videojs.log('player will dispose')
    })
  }
  return (
    <>
      <div>Rest of app here</div>
      <Player
        option={{ url: '/stream' }}
        style={{
          width: '600px',
          height: '400px',
          margin: '60px auto 0',
        }}
        getInstance={(art) => console.info(art)}
      />
      <div>Rest of app here</div>
      {/*<Toaster />*/}
    </>
  )
}
