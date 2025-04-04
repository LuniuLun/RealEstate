const updateItemInArray = <T extends { id: number }>(array: T[], updatedItem: Partial<T>): T[] => {
  return array.map((item) => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
}

export default updateItemInArray
