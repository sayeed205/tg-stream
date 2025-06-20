import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import db from '@adonisjs/lucid/services/db'

import withID from '#models/utils/with_id'
import { withTimestamps } from '#models/utils/with_timestamps'
import type { ExtraVideos, MediaLinks, MediaMeta } from '#types/media'

export default class Movie extends compose(BaseModel, withID(), withTimestamps()) {
  @column()
  declare title: string

  @column()
  declare originalTitle: string

  @column()
  declare releaseDate: string

  @column()
  declare overview: string

  @column()
  declare tagline: string

  @column()
  declare poster: string

  @column()
  declare backdrop: string

  @column()
  declare logo?: string

  @column()
  declare runtime: number

  @column()
  declare popularity: number

  @column()
  declare voteAverage: number

  @column()
  declare voteCount: number

  @column()
  declare adult: boolean

  @column()
  declare genres: string[]

  @column({
    consume: (value) => value,
    prepare: (value) => JSON.stringify(value),
  })
  declare videos: ExtraVideos[]

  @column({
    consume: (value) => value,
    prepare: (value) => JSON.stringify(value),
  })
  declare links: MediaLinks[]

  @column({
    consume: (value) => value,
    prepare: (value) => JSON.stringify(value),
  })
  declare meta: MediaMeta

  @column()
  declare homepage: string

  @column()
  declare productionCountries: string[]

  @column({ serializeAs: null })
  declare searchVector: string

  @beforeCreate()
  public static async embeddingAndSearchVector(movie: Movie) {
    // search vector
    const { rows } = await db.rawQuery<{ rows: Array<{ vec: string }> }>(
      `SELECT to_tsvector(
      'english',
      coalesce(?::text, '') || ' ' || coalesce(?::text, '') || ' ' ||
      array_to_string(?::text[], ' ') || ' ' || coalesce(?::text, '')
    ) AS vec`,
      [movie.title, movie.overview, movie.genres, movie.tagline]
    )

    movie.searchVector = rows[0].vec
  }
}
