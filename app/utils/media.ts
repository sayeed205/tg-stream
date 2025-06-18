type ParsedMedia = {
  title: string
  year: number
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
    season: seasonStr ? Number.parseInt(seasonStr) : undefined,
    episode: episodeStr ? Number.parseInt(episodeStr) : undefined,
  }
}
