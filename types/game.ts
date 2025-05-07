export interface Game {
  id: number
  title: string
  description: string
  longDescription?: string
  imageUrl: string
  videoUrl: string
  iconUrl?: string
  rating: number
  platform: string
  categories: string[]
  releaseDate?: string
  trendingScore: number
  downloadUrl: string
  screenshots?: string[]
  requirements?: {
    minimum: SystemRequirements
    recommended: SystemRequirements
  }
}

interface SystemRequirements {
  os: string
  processor: string
  memory: string
  graphics: string
  storage: string
}
