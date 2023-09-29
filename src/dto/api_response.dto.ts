import { Character } from "../db_models/Character"
import { Episode } from "../db_models/Episode"
import { Location } from "../db_models/Location"

export interface ApiResponse {
    info: {
      count: number
      pages: number
      next: string | null
      prev: string | null
    }
    results: Character[] | Episode[] | Location[]
  }