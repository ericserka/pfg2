import { useUserAuth } from '../../store/auth/provider'
import { useUserLocation } from '../../store/location/provider'
import { CenterLoading } from './CenterLoading'

export const LoadingInterceptor = ({ children, extra }) => {
  // add loading of each provider here

  const {
    state: { loading: loadingLoc },
  } = useUserLocation()
  const {
    state: { queryLoading: loadingAuth },
  } = useUserAuth()

  const loading = [loadingLoc, loadingAuth, ...(extra ?? [])].some((l) => l)

  return loading ? <CenterLoading /> : children
}
