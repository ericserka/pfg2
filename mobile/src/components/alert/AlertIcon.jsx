import { CheckCircleIcon, InfoIcon, WarningIcon } from 'native-base'

export const AlertIcon = ({ type, ...rest }) => {
  switch (type) {
    case 'info':
      return <InfoIcon color="white" {...rest} />
    case 'warning':
    case 'error':
      return <WarningIcon color="white" {...rest} />
    case 'success':
      return <CheckCircleIcon color="white" {...rest} />
    default:
      return <></>
  }
}
