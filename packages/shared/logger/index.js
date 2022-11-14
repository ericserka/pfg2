import { logger, consoleTransport } from 'react-native-logs'

export const log = logger.createLogger({
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  transport: consoleTransport,
  transportOptions: {
    colors: {
      debug: 'magentaBright',
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
})
