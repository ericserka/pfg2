import { InviteAction } from './actions/InviteAction'
import { HelpAction } from './actions/HelpAction'
import { MessageAction } from './actions/MessageAction'

export const NotificationAction = ({ notification }) => {
  switch (notification.type) {
    case 'INVITE':
      return <InviteAction notification={notification} />
    case 'HELP':
      return <HelpAction notification={notification} />
    case 'MESSAGE':
      return <MessageAction />
    default:
      return <></>
  }
}
