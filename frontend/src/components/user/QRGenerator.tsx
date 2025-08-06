import { QRCodeCanvas } from 'qrcode.react';

const baseURL = import.meta.env.VITE_API_BASEURL
const QRGenerator = ({booking_id}:{booking_id:string}) => {
  const valueToEncode = `${baseURL}/booking-scan/${booking_id}`;

  return (
    <div className='flex flex-col items-center bg-white justify-center p-3 rounded-lg shadow-lg'>
      <h2 className='text-lg font-semibold text-black mb-4'>Scan to Start Ride</h2>
      <QRCodeCanvas
        value={valueToEncode}
        size={200}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H" 
      />
    </div>
  );
};

export default QRGenerator;
