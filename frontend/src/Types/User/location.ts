
export interface Ilocation {
  _id?:string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
   location: {
    type: 'Point';
    coordinates: [number, number]; 
  };
}
