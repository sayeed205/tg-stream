import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm;')
    this.schema.createTable(this.tableName, (table) => {
      table.bigInteger('id').primary()
      table.string('title').notNullable()
      table.string('original_title').notNullable()
      table.date('release_date').notNullable()
      table.text('overview').notNullable()
      table.string('tagline').notNullable()
      table.string('poster').notNullable()
      table.string('backdrop').notNullable()
      table.string('logo').nullable()
      table.integer('runtime').notNullable()
      table.float('popularity').notNullable()
      table.float('vote_average').notNullable()
      table.integer('vote_count').notNullable()
      table.boolean('adult').notNullable()
      table.specificType('genres', 'text[]').notNullable()
      table.jsonb('videos').notNullable()
      table.jsonb('links').nullable()
      table.text('homepage').notNullable()
      table.jsonb('meta').notNullable()
      table.specificType('production_countries', 'text[]').notNullable()

      // ✅ Full-text search vector
      table.specificType('search_vector', 'tsvector')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      // ✅ Full-text search index
      this.schema.raw(`
      CREATE INDEX movies_search_vector_idx
      ON ${this.tableName}
      USING GIN (search_vector);
    `)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
