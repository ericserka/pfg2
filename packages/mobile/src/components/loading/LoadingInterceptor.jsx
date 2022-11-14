import { CenterLoading } from './CenterLoading'

export const LoadingInterceptor = ({ loading, children }) =>
  loading ? <CenterLoading /> : children
