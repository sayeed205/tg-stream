import type HomeController from '#controllers/home_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link, usePage } from '@inertiajs/react'
import { DateTime } from 'luxon'
import { useEffect, useRef, useState } from 'react'
import { Icons } from '~/components/icons'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export default function Home({ recentMovies }: InferPageProps<HomeController, 'index'>) {
  const mediaItems = recentMovies ?? []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false) // Keep for existing logic for main carousel
  const [progress, setProgress] = useState(0)

  const { url } = usePage()
  // State for the "Recently Added" section - using ref for scrolling
  const carouselRef = useRef<HTMLDivElement>(null)

  const SLIDE_DURATION = 6000
  const PROGRESS_UPDATE_INTERVAL = 100

  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const slideInterval = useRef<NodeJS.Timeout | null>(null)
  const slideStartTime = useRef<number>(Date.now())
  const resumeTimeout = useRef<NodeJS.Timeout | null>(null)
  const savedElapsed = useRef<number>(0)

  // Main Carousel Logic
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setProgress(0)
    slideStartTime.current = Date.now()
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length)
    setProgress(0)
    slideStartTime.current = Date.now()
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)
    setProgress(0)
    slideStartTime.current = Date.now()
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
    clearInterval(slideInterval.current!)
    clearTimeout(resumeTimeout.current!)

    const elapsed = Date.now() - slideStartTime.current
    const remaining = SLIDE_DURATION - elapsed

    resumeTimeout.current = setTimeout(() => {
      nextSlide()
      slideInterval.current = setInterval(() => {
        nextSlide()
      }, SLIDE_DURATION)
    }, remaining)
  }

  const stopAutoSlide = () => {
    clearInterval(slideInterval.current!)
    clearTimeout(resumeTimeout.current!)
  }

  // Effect for Main Carousel
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

  // Recently Added Carousel Logic
  const itemsPerPage = 6 // Number of items to show per slide in the recently added section

  const nextRecentMovies = () => {
    if (!carouselRef.current) return
    // Assuming each card has w-40 (160px) and mr-4 (16px), total item width is 176px
    const itemFullWidth = 160 + 16
    const scrollAmount = itemFullWidth * itemsPerPage
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const prevRecentMovies = () => {
    if (!carouselRef.current) return
    const itemFullWidth = 160 + 16
    const scrollAmount = itemFullWidth * itemsPerPage
    carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      if (e.shiftKey && e.deltaY !== 0) {
        e.preventDefault()
        el.scrollBy({ left: e.deltaY, behavior: 'smooth' })
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      el.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <>
      <Head>
        <meta
          name="description"
          content="tg-stream: Your one stop destination for all Media needs."
        />
      </Head>
      <div className="relative bg-background text-foreground">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6">
          <nav className="relative flex h-10 items-center rounded-full bg-background/20 p-1 shadow-md backdrop-blur-md">
            {/* Home button */}
            <button
              className={cn(
                'relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                url === '/' // Check if current URL is home path
                  ? 'bg-primary text-primary-foreground' // Active state classes
                  : 'text-muted-foreground hover:text-foreground' // Inactive state classes
              )}
            >
              <Link href="/" aria-label="Home">
                <Icons.house className="h-4 w-4" /> {/* Smaller icon size */}
              </Link>
            </button>

            {/* Movies button */}
            <button
              className={cn(
                'relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                url.startsWith('/movies')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Link href="/movies" aria-label="Movies">
                <Icons.film className="h-4 w-4" />
              </Link>
            </button>

            {/* Shows button */}
            <button
              className={cn(
                'relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                url.startsWith('/shows') // Check if current URL starts with /shows
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Link href="/shows" aria-label="TV Shows">
                <Icons.tv className="h-4 w-4" />
              </Link>
            </button>
          </nav>
          {/* <ThemeSwitcher /> */}
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href="/search" className="text-lg font-semibold">
                <Icons.search />
              </Link>
            </Button>
            {/* Using text-foreground for button icons where applicable based on theme */}
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/20">
              <Icons.user className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Carousel */}
        <div
          className="relative h-[calc(100dvh-2rem)] overflow-hidden"
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
              const logo = item.logo ? 'https://image.tmdb.org/t/p/w500/' + item.logo : ''

              return (
                <div
                  key={item.Id}
                  className="min-w-full h-full relative flex-shrink-0"
                  style={{
                    backgroundImage: `url(${itemBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Using custom variables for gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-20 pb-24">
                    <div className="max-w-2xl">
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
                        <Badge
                          variant="secondary"
                          className="bg-destructive text-background text-base font-bold"
                        >
                          HD
                        </Badge>
                        {item.voteAverage > 0 && (
                          <span className="text-lg text-muted-foreground flex items-center gap-1">
                            <Icons.star className="h-4 w-4 text-yellow-400" />{' '}
                            {item.voteAverage.toFixed(1)}/10
                          </span>
                        )}
                        <span className="text-lg text-muted-foreground">
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
                        <Button
                          className="gap-2 p-6 w-[20%] text-lg rounded-full bg-foreground/20 backdrop-blur-md
             hover:bg-foreground/50 shadow-xl hover:shadow-2xl
             transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <Icons.play className="fill-destructive text-destructive" /> Play
                        </Button>
                        <Button
                          asChild
                          variant="secondary"
                          size="icon"
                          className="p-6 rounded-full backdrop-blur-md bg-secondary/20 hover:bg-secondary/50"
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

          {/* Navigation Arrows for Main Carousel */}
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
                    ? 'w-12 bg-card' // Using bg-card for active indicator
                    : 'w-2 bg-muted-foreground hover:bg-muted-foreground/50 cursor-pointer'
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

        {/* Recently Added Movies Section */}
        <div className="p-8 mt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-destructive">•</span> Recently Added in Movies{' '}
              <span className="text-destructive">•</span>
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 text-foreground hover:bg-foreground/20"
                onClick={prevRecentMovies}
              >
                <Icons.chevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 text-foreground hover:bg-foreground/20"
                onClick={nextRecentMovies}
              >
                <Icons.chevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div ref={carouselRef} className="flex overflow-x-hidden scroll-smooth pb-4 no-scrollbar">
            {[
              ...recentMovies,
              ...recentMovies,
              ...recentMovies,
              ...recentMovies,
              ...recentMovies,
              ...recentMovies,
            ].map((item, index) => {
              const poster = 'https://image.tmdb.org/t/p/w300/' + item.poster
              return (
                <div
                  key={`${item.Id}-${index}`}
                  className="flex-shrink-0 w-40 mr-4 group rounded-md overflow-hidden shadow-lg"
                >
                  <div className="relative w-full h-60 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                    <img src={poster} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <Button
                        size="icon"
                        className="rounded-full h-10 w-10 bg-destructive backdrop-blur-sm text-background hover:bg-destructive/80"
                      >
                        <Icons.play className="h-5 w-5 fill-current" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold truncate">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {DateTime.fromISO(item.releaseDate).year}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
