import { CenterLoading } from './CenterLoading'

export const LoadingInterceptor = ({ children, loading }) => {
  return loading ? <CenterLoading /> : children
}
