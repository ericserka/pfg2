import dayjs from 'dayjs'

// import the plugins

import ptBR from 'dayjs/locale/pt-br'
import localizedFormat from 'dayjs/plugin/localizedFormat'

// apply the plugins

dayjs.extend(localizedFormat)
dayjs.locale(ptBR)

// export the extended dayjs

export default dayjs
