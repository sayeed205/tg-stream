import type HomeController from '#controllers/home_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link } from '@inertiajs/react'
import { DateTime } from 'luxon'
import { useEffect, useRef, useState } from 'react'
import { Icons } from '~/components/icons'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export default function Home({ recentMovies }: InferPageProps<HomeController, 'index'>) {
  const mediaItems = recentMovies ?? []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [progress, setProgress] = useState(0)

  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const slideInterval = useRef<NodeJS.Timeout | null>(null)

  const slideStartTime = useRef<number>(Date.now())
  const resumeTimeout = useRef<NodeJS.Timeout | null>(null)

  const savedElapsed = useRef<number>(0)

  const SLIDE_DURATION = 6000
  const PROGRESS_UPDATE_INTERVAL = 100

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setProgress(0)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length)
    setProgress(0)
    slideStartTime.current = Date.now()
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)
    setProgress(0)
  }

  // Progress bar control
  const startProgress = () => {
    clearInterval(progressInterval.current!)
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (PROGRESS_UPDATE_INTERVAL / SLIDE_DURATION) * 100
        return next >= 100 ? 100 : next
      })
    }, PROGRESS_UPDATE_INTERVAL)
  }

  const stopProgress = () => {
    clearInterval(progressInterval.current!)
  }

  // Slide control
  const startAutoSlide = () => {
    // Clear any pending timeouts or intervals
    clearInterval(slideInterval.current!)
    clearTimeout(resumeTimeout.current!)

    const elapsed = Date.now() - slideStartTime.current
    const remaining = SLIDE_DURATION - elapsed

    // Schedule next slide using remaining time
    resumeTimeout.current = setTimeout(() => {
      nextSlide()
      // After sliding, start normal interval again
      slideInterval.current = setInterval(() => {
        nextSlide()
      }, SLIDE_DURATION)
    }, remaining)
  }

  const stopAutoSlide = () => {
    clearInterval(slideInterval.current!)
    clearTimeout(resumeTimeout.current!)
  }

  useEffect(() => {
    if (mediaItems.length === 0) return

    if (!isHovering) {
      startProgress()
      startAutoSlide()
    } else {
      stopProgress()
      stopAutoSlide()
    }

    return () => {
      stopProgress()
      stopAutoSlide()
    }
  }, [isHovering, mediaItems.length])

  return (
    <>
      <Head>
        <meta
          name="description"
          content="tg-stream: Your one stop destination for all Media needs."
        />
      </Head>
      <div className="relative min-h-svh bg-black text-white">
        {' '}
        {/* Full height background */}
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6">
          <nav className="flex items-center gap-1">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href="/" className="text-lg font-semibold">
                <Icons.house />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href="/movies" className="text-lg font-semibold">
                <Icons.film />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href="/shows" className="text-lg font-semibold">
                <Icons.tv />
              </Link>
            </Button>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href="/search" className="text-lg font-semibold">
                <Icons.search />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Icons.user className="h-5 w-5" />
            </Button>
          </div>
        </header>
        {/* Carousel */}
        <div
          className="relative h-svh overflow-hidden"
          onMouseEnter={() => {
            setIsHovering(true)
            savedElapsed.current = Date.now() - slideStartTime.current
          }}
          onMouseLeave={() => {
            setIsHovering(false)
            slideStartTime.current = Date.now() - savedElapsed.current
            startAutoSlide()
            startProgress()
          }}
        >
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {mediaItems.map((item) => {
              const itemBg = 'https://image.tmdb.org/t/p/original' + item.backdrop
              const logo = item.logo ? 'https://image.tmdb.org/t/p/w500/' + item.logo : '' // Retain logo logic

              return (
                <div
                  key={item.Id} // Assuming 'Id' is the unique identifier for each media item
                  className="min-w-full h-full relative flex-shrink-0"
                  style={{
                    backgroundImage: `url(${itemBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Dark gradient overlay similar to the image */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-20 pb-24">
                    {' '}
                    {/* Increased padding to match image */}
                    <div className="max-w-2xl">
                      {/* Conditional rendering for logo or title */}
                      {logo ? (
                        <div
                          className="w-full h-20 bg-contain bg-no-repeat bg-left mb-2"
                          style={{
                            backgroundImage: `url(${logo})`,
                          }}
                        />
                      ) : (
                        <h1 className="text-8xl font-bold mb-4 uppercase">{item.title}</h1>
                      )}

                      <div className="flex items-center gap-4 mb-4">
                        {' '}
                        {/* Increased gap */}
                        <Badge
                          variant="outline"
                          className="bg-destructive text-background border-primary text-base font-bold"
                        >
                          {' '}
                          {/* Styling similar to image */}
                          HD
                        </Badge>
                        {item.voteAverage > 0 && ( // Display voteAverage if available and greater than 0
                          <span className="text-lg text-muted-foreground flex items-center gap-1">
                            {' '}
                            {/* Adjust text size */}
                            <Icons.star className="h-4 w-4 text-yellow-400" />{' '}
                            {item.voteAverage.toFixed(1)}/10
                          </span>
                        )}
                        <span className="text-lg text-muted-foreground">
                          {' '}
                          {DateTime.fromISO(item.releaseDate).year}
                        </span>
                        {item.runtime && (
                          <span className="text-lg text-muted-foreground">
                            {Math.floor(item.runtime / 60)}h {item.runtime % 60}m
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {item.genres?.map((genre: string) => (
                          <Badge
                            key={genre}
                            variant="secondary"
                            className=" text-base rounded-full"
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-muted-foreground text-lg mb-8 line-clamp-3">
                        {item.overview}
                      </p>
                      <div className="flex items-center gap-4">
                        <Button className="gap-2 p-6 w-[20%] text-lg rounded-full">
                          <Icons.play /> Play
                        </Button>
                        <Button
                          asChild
                          variant="secondary"
                          size="icon"
                          className="p-6 rounded-full"
                        >
                          <Link href={`/movies/${item.id}`}>
                            <Icons.info className="text-foreground" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 cursor-pointer"
            onClick={prevSlide}
          >
            <Icons.chevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 cursor-pointer"
            onClick={nextSlide}
          >
            <Icons.chevronRight className="h-6 w-6" />
          </Button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                className={cn(
                  'h-2 rounded-full transition-all relative overflow-hidden ',
                  index === currentIndex
                    ? 'w-12 bg-card' // Active indicator color changed to white
                    : 'w-2 bg-muted-foreground hover:bg-muted-foreground/50 cursor-pointer' // Inactive indicator color
                )}
                onClick={() => goToSlide(index)}
              >
                {index === currentIndex && (
                  <>
                    <div
                      className="absolute inset-y-0 left-0 bg-destructive rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
