export interface StepOneFormData {
  name: string;
  brand: string;
  registration_number: string;
  fuel_type: 'petrol' | 'diesel' | 'electric';
  seats: 2 | 4 | 5 | 7;
  car_type: 'sedan' | 'hateback' | 'xuv' | 'suv' | 'sports';
  automatic: boolean;
  price_per_day: number;
  description: string;
}


export interface StepTwoFormData {
  image_urls: File | string[];

}

export interface StepThreeFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
}