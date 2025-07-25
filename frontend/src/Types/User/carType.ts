

export interface CarFilters {
  fuel_type: "petrol" | "diesel" | "electric"
  seats: 2 | 4 | 5 | 7
  car_type: "sedan" | "hatchback" | "xuv" | "suv" | "sports"
  automatic: boolean
  price_per_day: number
  is_available?: boolean
}
export interface FilterState {
  search: string
  fuel_types: string[]
  seats: number[]
  car_types: string[]
  transmission: string[]
  price_range: [number, number]
  available_only: boolean
}
