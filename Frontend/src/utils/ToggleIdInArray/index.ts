const toggleIdInArray = (array: number[], id: number): number[] => {
  if (array.includes(id)) {
    return array.filter((item) => item !== id)
  } else {
    return [...array, id]
  }
}

export default toggleIdInArray
