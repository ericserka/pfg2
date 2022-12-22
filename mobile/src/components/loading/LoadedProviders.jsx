import { useUserAuth } from '../../store/auth/provider'
import { useUserGroup } from '../../store/groups/provider'
import { LoadingInterceptor } from '../loading/LoadingInterceptor'

export const LoadedProviders = ({ children }) => {
  const {
    state: { queryLoading: authLoading },
  } = useUserAuth()
  const {
    state: { queryLoading: groupsLoading, current },
  } = useUserGroup()

  const loading = [authLoading, groupsLoading, !current].some((l) => l)

  return <LoadingInterceptor loading={loading}>{children}</LoadingInterceptor>
}
