import importedDayJs from 'dayjs'

// import the plugins

import ptBR from 'dayjs/locale/pt-br'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// apply the plugins

importedDayJs.extend(localizedFormat)
importedDayJs.extend(customParseFormat)
importedDayJs.locale(ptBR)

// export the extended dayjs

export const dayjs = importedDayJs
