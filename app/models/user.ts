import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import withCUID from './utils/with_cuid.js'
import { withTimestamps } from './utils/with_timestamps.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, withCUID(), withTimestamps()) {
  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string
}
