import { Image } from 'tmdb-ts'

type ParsedMedia = {
  title: string
  year: number
  type: 'movie' | 'tv'
  season?: number
  episode?: number
}

export function parseMediaInfo(input: string): ParsedMedia | null {
  const regex = /^(.*?)(?:\s+)?(\d{4})(?:\s+S(\d{1,3})E(\d{1,4}))?$/i
  const match = input.match(regex)

  if (!match) return null

  const [, rawTitle, yearStr, seasonStr, episodeStr] = match

  return {
    title: rawTitle.trim(),
    year: Number.parseInt(yearStr),
    type: seasonStr ? 'tv' : 'movie',
    season: seasonStr ? Number.parseInt(seasonStr) : undefined,
    episode: episodeStr ? Number.parseInt(episodeStr) : undefined,
  }
}

export function getImage(images: Image[]): string {
  if (!images.length) return ''
  return (
    images.find((image) => {
      if (image.iso_639_1 === 'en' || image.iso_639_1 === 'in') {
        return true
      }
      return true
    })?.file_path || ''
  )
}
