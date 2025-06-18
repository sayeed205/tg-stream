import app from '@adonisjs/core/services/app'

/**
 * This file is imported in providers/tg_provider.ts and registered as a provider.
 */

// export const tg = new TelegramClient({
//   apiId: env.get('TG_API_ID'),
//   apiHash: env.get('TG_API_HASH'),
// })
// export const dp = Dispatcher.for(tg)
// const self = await tg.start({ botToken: env.get('TG_MAIN_BOT_TOKEN') })
// console.info(`Logged in Telegram as '${self.displayName}'`)
const { tg } = await app.container.make('tg')
