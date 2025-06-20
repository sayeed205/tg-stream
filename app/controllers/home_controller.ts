import Movie from '#models/movie'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  /**
   * Display a list of all users
   */
  async index({ inertia }: HttpContext) {
    const recentMovies = await Movie.query().orderBy('created_at', 'desc').limit(10)

    return inertia.render('home', {
      recentMovies,
    })
  }
}
