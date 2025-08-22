import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Trash2, Calendar, MapPin, Fuel, Users, Settings } from "lucide-react";
import Navbar from "@/components/user/Navbar";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";

// Dummy wishlist data
const dummyWishlistItems = [
  {
    id: "1",
    name: "BMW X5",
    brand: "BMW",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400",
    price: 8500,
    location: "Mumbai, Maharashtra",
    fuel_type: "petrol",
    seats: 5,
    transmission: true,
    rating: 4.8,
    addedDate: "2024-08-01"
  },
  {
    id: "2",
    name: "Audi A4",
    brand: "Audi",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
    price: 7200,
    location: "Delhi, NCR",
    fuel_type: "diesel",
    seats: 5,
    transmission: true,
    rating: 4.6,
    addedDate: "2024-07-28"
  },
  {
    id: "3",
    name: "Mercedes C-Class",
    brand: "Mercedes",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400",
    price: 9200,
    location: "Bangalore, Karnataka",
    fuel_type: "petrol",
    seats: 5,
    transmission: true,
    rating: 4.9,
    addedDate: "2024-07-25"
  },
  {
    id: "4",
    name: "Toyota Camry",
    brand: "Toyota",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400",
    price: 6800,
    location: "Chennai, Tamil Nadu",
    fuel_type: "hybrid",
    seats: 5,
    transmission: true,
    rating: 4.7,
    addedDate: "2024-07-20"
  },
  {
    id: "5",
    name: "Honda Civic",
    brand: "Honda",
    image: "https://images.unsplash.com/photo-1606016159991-7d4b0e4e7d8c?w=400",
    price: 5500,
    location: "Pune, Maharashtra",
    fuel_type: "petrol",
    seats: 5,
    transmission: false,
    rating: 4.5,
    addedDate: "2024-07-15"
  },
  {
    id: "6",
    name: "Hyundai Creta",
    brand: "Hyundai",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400",
    price: 4200,
    location: "Hyderabad, Telangana",
    fuel_type: "diesel",
    seats: 5,
    transmission: true,
    rating: 4.4,
    addedDate: "2024-07-10"
  }
];

function Wishlist() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [wishlistItems, setWishlistItems] = useState(dummyWishlistItems);

  // Pagination calculations
  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = wishlistItems.slice(startIndex, startIndex + itemsPerPage);

  const removeFromWishlist = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    // Adjust current page if needed
    const newTotalPages = Math.ceil((wishlistItems.length - 1) / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <motion.div
        className="container mx-auto px-4 py-8 mt-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            My Wishlist
          </h1>
          <p className="text-gray-400">
            {wishlistItems.length} vehicle{wishlistItems.length !== 1 ? 's' : ''} saved for later
          </p>
        </motion.div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="text-center py-16"
          >
            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
            <p className="text-gray-400">Start adding vehicles you love to see them here!</p>
          </motion.div>
        ) : (
          <>
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              {paginatedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromWishlist(item.id)}
                        className="bg-black/50 hover:bg-red-600 text-white backdrop-blur-sm rounded-full p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ⭐ {item.rating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-400">{formatCurrency(item.price)}</p>
                        <p className="text-gray-400 text-sm">per day</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4 text-gray-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{item.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4 text-gray-300">
                      <div className="flex items-center gap-1">
                        <Fuel className="w-4 h-4" />
                        <span className="text-sm capitalize">{item.fuel_type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{item.seats} seats</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">{item.transmission ? 'Auto' : 'Manual'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Added {new Date(item.addedDate).toLocaleDateString()}</span>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div variants={itemVariants}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

export default Wishlist;