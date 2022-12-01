import { InviteAction } from './actions/InviteAction'
import { HelpAction } from './actions/HelpAction'
import { MessageAction } from './actions/MessageAction'

export const NotificationAction = ({ type, status, sender }) => {
  switch (type) {
    case 'INVITE':
      return <InviteAction status={status} />
    case 'HELP':
      return <HelpAction sender={sender} />
    case 'MESSAGE':
      return <MessageAction />
    default:
      return <></>
  }
}
