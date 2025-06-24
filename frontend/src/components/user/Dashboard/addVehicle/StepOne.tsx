
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface StepOneProps {
  onSubmit: (data: StepOneFormData) => void;
  defaultValues?: StepOneFormData;
}

interface StepOneFormData {
  name: string;
  brand: string;
  registrationNumber: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  seats: 2 | 4 | 5 | 7;
  carType: 'Sedan' | 'Hatchback' | 'XUV' | 'SUV' | 'Sports';
  isAutomatic: boolean;
  pricePerDay: number;
}

export default function StepOne({ onSubmit, defaultValues }: StepOneProps) {
  const form = useForm<StepOneFormData>({
    defaultValues: defaultValues || {
      name: '',
      brand: '',
      registrationNumber: '',
      fuelType: 'Petrol',
      seats: 4,
      carType: 'Sedan',
      isAutomatic: false,
      pricePerDay: 0,
    },
  });

  const handleSubmit = (data: StepOneFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter vehicle name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input placeholder="Enter brand (e.g., Toyota)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter registration number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fuelType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fuel Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="seats"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seats</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of seats" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[2, 4, 5, 7].map((num) => (
                    <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="carType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select car type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['Sedan', 'Hatchback', 'XUV', 'SUV', 'Sports'].map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isAutomatic"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Automatic Transmission</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pricePerDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Per Day</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter price per day" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" className="hidden" aria-label="Submit form" />
      </form>
    </Form>
  );
}
