export const removeDuplicateArrayObjectsById = (arr) => [
  ...new Map(arr.map((obj) => [obj.id, obj])).values(),
]
