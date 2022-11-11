export const handleError = (err) => {
  const axiosErrorMessage = err?.response?.data?.message
  return axiosErrorMessage ? axiosErrorMessage : err?.message
}
