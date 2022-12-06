export const handleHttpError = (err) => {
  const axiosErrorMessage = err?.response?.data?.message
  return axiosErrorMessage ? axiosErrorMessage : err?.message
}
