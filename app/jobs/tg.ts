import logger from '@adonisjs/core/services/logger'
import { Document, Video } from '@mtcute/node'
import { BaseJob } from 'adonis-resque'
import { TMDB } from 'tmdb-ts'

import Movie from '#models/movie'
import env from '#start/env'
import { getImage, parseMediaInfo } from '#utils/media'

const tmdb = new TMDB(env.get('TMDB_API_KEY'))

interface TGJobProps {
  text: string
  media: Document | Video
}

export default class TGJob extends BaseJob {
  async perform({ media, text }: TGJobProps) {
    logger.info(`Processing: ${media.fileName}, ${text}`)
    const meta = parseMediaInfo(text)
    if (!meta) return logger.error(`Failed to parse media info: ${text}`)
    try {
      const result = await tmdb.search.movies({
        query: meta.title,
        year: meta.year,
        include_adult: true,
      })
      if (!result.total_results) return logger.error(`No results found for: ${text}`)
      const movieResult = result.results[0]

      const movie = await tmdb.movies.details(movieResult.id, ['videos', 'external_ids', 'images'])
      const {
        adult,
        backdrop_path,
        genres,
        homepage,
        id,
        original_title,
        popularity,
        title,
        images,
        overview,
        production_countries,
        runtime,
        release_date,
        tagline,
        videos,
        vote_average,
        vote_count,
      } = movie

      const movieDb = await Movie.create({
        id: id.toString(),
        title,
        adult,
        backdrop: backdrop_path,
        genres: genres.map((genre) => genre.name),
        originalTitle: original_title,
        popularity,
        homepage: homepage,
        logo: getImage(images.logos),
        meta: {
          fileId: media.fileId,
          type: media.mimeType,
          size: media.fileSize!,
        },
        overview,
        poster: getImage(images.posters),
        productionCountries: production_countries.map((country) => country.name),
        releaseDate: release_date,
        runtime,
        tagline,
        videos: videos.results
          .filter((video) => {
            return video.site === 'YouTube'
          })
          .map((video) => ({
            key: video.key,
            name: video.name,
            type: video.type,
          })),
        voteAverage: vote_average,
        voteCount: vote_count,
      })

      logger.info({ movieDb }, 'Movie added')
    } catch (error) {
      logger.error(error, 'TGJob')
    }
  }
}
