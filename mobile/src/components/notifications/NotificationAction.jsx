import { HelpAction } from './actions/HelpAction'
import { InviteAction } from './actions/InviteAction'
import { MessageAction } from './actions/MessageAction'

export const NotificationAction = ({ notification }) => {
  switch (notification.type) {
    case 'INVITE':
      return <InviteAction notification={notification} />
    case 'HELP':
      return <HelpAction notification={notification} />
    case 'MESSAGE':
      return <MessageAction groupId={notification.groupId} />
    default:
      return <></>
  }
}
