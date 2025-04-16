const parseImagesString = (images: string | undefined): string[] => {
  if (!images) return []
  return images.split(',').map((img) => img.trim())
}

export default parseImagesString
