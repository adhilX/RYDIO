import { User, Car, Wallet, Calendar, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const navigationItems = [
    { name: 'Profile', icon: User, active: true },
    { name: 'userProfile/Vehicles', icon: Car, active: false },
    { name: 'Wallet', icon: Wallet, active: false },
    { name: 'Bookings', icon: Calendar, active: false },
    { name: 'Support', icon: HelpCircle, active: false },
  ];

  return (
    <div className="w-64 bg-dark-card border-r border-dark-border h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-dark-border">
        <img 
          src="/lovable-uploads/fd74bcda-aee3-4629-ac60-2f2a45c7b3ba.png" 
          alt="RYDIO" 
          className="h-8 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <button
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200",
                  item.active
                    ? "bg-red-900/30 text-white border border-red-800/50"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
