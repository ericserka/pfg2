import dayjs from 'dayjs'

// import the plugins

import ptBR from 'dayjs/locale/pt-br.js'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'

// apply the plugins

dayjs.extend(localizedFormat)
dayjs.locale(ptBR)

// export the extended dayjs

export default dayjs
