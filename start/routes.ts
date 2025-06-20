/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import Movie from '#models/movie'
import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'

// const { tg } = await app.container.make('tg')
// const tgVideo = await tg.getMessageByLink('https://t.me/c/2437460318/83')
// const PREFERRED_TG_CHUNK_SIZE = 1024 * 1024 // 1 MB

// console.log(tgVideo)

// router.get('/stream', async ({ request, response }) => {
//   if (!tgVideo) return response.notFound()

//   if (tgVideo.media?.type !== 'document') return response.notFound()
//   const { fileId, fileSize, mimeType } = tgVideo.media
//   const range = request.header('range')

//   let start = 0
//   let end = fileSize! - 1
//   let contentLength = fileSize! // Default for full file

//   if (range) {
//     const parts = range.replace(/bytes=/, '').split('-')
//     start = Number.parseInt(parts[0], 10)
//     end = parts[1] ? Number.parseInt(parts[1], 10) : fileSize! - 1

//     // Validate the requested range
//     if (start >= fileSize! || end < start || start < 0) {
//       return response
//         .status(416)
//         .header('Content-Range', `bytes */${fileSize}`)
//         .send('Range Not Satisfiable')
//     }

//     contentLength = end - start + 1

//     response.status(206)
//     response.header('Accept-Ranges', 'bytes')
//     response.header('Content-Range', `bytes ${start}-${end}/${fileSize}`)
//     response.header('Content-Length', contentLength)
//   } else {
//     // No range requested, send full file
//     response.status(200) // Changed to 200 for full file
//   }

//   response.header('Content-Length', contentLength) // This is the length for the browser

//   // Enhance MIME type with codec information based on file type

//   response.header('Content-Type', mimeType)
//   response.header('Accept-Ranges', 'bytes')
//   response.header('Access-Control-Allow-Origin', '*') // Add CORS headers for wider compatibility
//   response.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
//   response.header('Access-Control-Allow-Headers', 'Range, Content-Type')

//   // --- MTcute Alignment and Chunking Logic (inspired by Python) ---
//   // Calculate the actual offset for MTcute, aligned to PREFERRED_TG_CHUNK_SIZE
//   const mtcuteOffset = Math.floor(start / PREFERRED_TG_CHUNK_SIZE) * PREFERRED_TG_CHUNK_SIZE

//   // Calculate how many bytes we need to skip from the start of the mtcute stream
//   const bytesToSkipFromMtcuteStream = start - mtcuteOffset

//   // Calculate how much data MTcute should download from its aligned offset.
//   // This will be at least the PREFERRED_TG_CHUNK_SIZE, or up to the end of the file.
//   let mtcuteLimit = end - mtcuteOffset + 1 // Initially, the exact amount needed for the browser's chunk

//   // If the requested range is smaller than our preferred chunk size,
//   // we still request at least PREFERRED_TG_CHUNK_SIZE from Telegram,
//   // ensuring we don't make too many tiny requests.
//   if (mtcuteLimit < PREFERRED_TG_CHUNK_SIZE && fileSize - mtcuteOffset >= PREFERRED_TG_CHUNK_SIZE) {
//     mtcuteLimit = PREFERRED_TG_CHUNK_SIZE
//   }
//   // Ensure we don't request beyond the file size
//   mtcuteLimit = Math.min(mtcuteLimit, fileSize - mtcuteOffset)
//   // -----------------------------------------------------------------

//   const mtcuteStream = tg.downloadAsNodeStream(fileId, {
//     offset: mtcuteOffset,
//     limit: mtcuteLimit,
//   })

//   let streamToClient = mtcuteStream

//   // 1. Skipper: Skips bytes if the browser's request start is not aligned with mtcuteOffset
//   if (bytesToSkipFromMtcuteStream > 0) {
//     let skippedBytes = 0
//     const skipper = new Transform({
//       transform(chunk, _encoding, callback) {
//         const remainingToSkip = bytesToSkipFromMtcuteStream - skippedBytes
//         if (remainingToSkip > 0) {
//           if (chunk.length <= remainingToSkip) {
//             skippedBytes += chunk.length
//             callback()
//             return
//           } else {
//             skippedBytes += remainingToSkip
//             this.push(chunk.slice(remainingToSkip))
//             callback()
//             return
//           }
//         }
//         this.push(chunk)
//         callback()
//       },
//     })
//     streamToClient = streamToClient.pipe(skipper)
//   }

//   // 2. Limiter: Ensures we only send 'contentLength' bytes to the client,
//   // especially if we downloaded more from Telegram (due to PREFERRED_TG_CHUNK_SIZE)
//   let bytesSentToClient = 0
//   const limiter = new Transform({
//     transform(chunk, _encoding, callback) {
//       const remainingToSend = contentLength - bytesSentToClient
//       if (remainingToSend <= 0) {
//         // Already sent enough, stop pushing.
//         // It's crucial to end the stream or signal completion if no more data is needed
//         this.push(null) // Signal end of stream
//         callback()
//         return
//       }

//       if (chunk.length <= remainingToSend) {
//         // Send the whole chunk
//         this.push(chunk)
//         bytesSentToClient += chunk.length
//       } else {
//         // Send only the necessary part of the chunk
//         this.push(chunk.slice(0, remainingToSend))
//         bytesSentToClient += remainingToSend
//         // Since we've sent the exact amount requested, signal end of stream
//         this.push(null)
//       }
//       callback()
//     },
//   })

//   streamToClient = streamToClient.pipe(limiter)

//   return response.stream(streamToClient, (error) => {
//     console.error('Streaming error:', error)
//   })

//   // If not a document, or other media type, you might want to handle it differently
//   // or return an error. Returning the type string directly isn't ideal.
// })

// router.get('/', async ({ response, inertia }) => {
//   if (!tgVideo) return response.notFound()

//   if (tgVideo.media?.type !== 'document') return response.notFound()

//   // Get the base MIME type
//   let mimeType = tgVideo.media.mimeType

//   // Enhance MIME type with codec information based on file type
//   if (mimeType === 'video/mp4') {
//     // Standard codec string for MP4 videos that works in most browsers
//     mimeType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
//   } else if (mimeType === 'video/webm') {
//     // Standard codec string for WebM videos
//     mimeType = 'video/webm; codecs="vp8, vorbis"'
//   } else if (mimeType === 'video/ogg') {
//     // Standard codec string for Ogg videos
//     mimeType = 'video/ogg; codecs="theora, vorbis"'
//   }
//   // Add more format-specific codec strings as needed

//   return inertia.render('home', { mime: mimeType })
// })

router.on('/').renderInertia('home')

router.get('/:query', async ({ params, response }) => {
  const rawQuery = params.query?.trim()
  if (!rawQuery) {
    return response.badRequest({ error: 'Query is required' })
  }

  // Add prefix operator for autocomplete behavior
  const tsQuery = `${rawQuery}:*`

  const results = await Movie.query()
    .select('*')
    .select(db.raw(`ts_rank_cd(search_vector, to_tsquery('english', ?)) AS rank`, [tsQuery]))
    .whereRaw(`search_vector @@ to_tsquery('english', ?)`, [tsQuery])
    .orWhere('title', 'ilike', `%${rawQuery}%`)
    .orWhere('original_title', 'ilike', `%${rawQuery}%`)
    .orWhere('overview', 'ilike', `%${rawQuery}%`)
    .orWhere('tagline', 'ilike', `%${rawQuery}%`)
    .orWhere('genres', '&&', [rawQuery])
    .orWhere('production_countries', '&&', [rawQuery])
    .orderByRaw('rank DESC')
    .orderBy('title')
    .limit(10)

  return response.json({
    query: rawQuery,
    count: results.length,
    results,
  })
})
