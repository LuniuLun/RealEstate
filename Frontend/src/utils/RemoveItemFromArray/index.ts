const removeItemFromArray = <T extends { id: number | string }>(array: T[], idToRemove: number | string): T[] => {
  if (!Array.isArray(array)) {
    console.error('removeItemFromArray called with non-array:', array)
    return []
  }

  return array.filter((item) => item.id !== idToRemove)
}

export default removeItemFromArray
