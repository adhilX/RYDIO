import { Button } from "../ui/button"

function VehicleCard({vehicle,setSelectedVehicle}) {
  return (
  <div
            key={vehicle.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col"
          >
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-bold">{vehicle.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">{vehicle.brand} - {vehicle.fuelType}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.carType} | {vehicle.seats} seats</p>
            <p className="text-sm font-medium mt-1">₹{vehicle.pricePerDay}/day</p>
            <Button
              className="mt-auto w-full"
              onClick={() => setSelectedVehicle(vehicle)}
            >
              View Details
            </Button>
          </div>  )
}

export default VehicleCard