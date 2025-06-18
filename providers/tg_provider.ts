import { Dispatcher, filters } from '@mtcute/dispatcher'
import { TelegramClient } from '@mtcute/node'

import type { ApplicationService } from '@adonisjs/core/types'

import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import { parseMediaInfo } from '#utils/media'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    tg: {
      tg: TelegramClient
      dp: Dispatcher<never>
    }
  }
}

export default class TgProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton('tg', () => {
      const tg = new TelegramClient({
        apiId: env.get('TG_API_ID'),
        apiHash: env.get('TG_API_HASH'),
      })
      const dp = Dispatcher.for(tg)
      return { tg, dp }
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {
    const { tg } = await this.app.container.make('tg')
    const self = await tg.start({ botToken: env.get('TG_MAIN_BOT_TOKEN') })

    const tgLogger = await this.app.container.make('tg:logger')

    await tgLogger.info(`Logged in Telegram as '${self.displayName}'`)
  }

  /**
   * The process has been started
   */
  async ready() {
    const { dp } = await this.app.container.make('tg')
    dp.onNewMessage(filters.media, async (ctx) => {
      logger.info(parseMediaInfo(ctx.text))
    })
  }

  /**
   * Preparing to shut down the app
   */
  async shutdown() {}
}
