export type NSFWImageValidationRequest = {
  image: File[]
}

export interface ImageClassificationResult {
  safeScore: number
  unsafeScore: number
  safe: boolean
}

export type NSFWImageValidationResponse = ImageClassificationResult[]
