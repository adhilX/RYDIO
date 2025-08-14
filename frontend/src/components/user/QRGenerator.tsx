import { QRCodeCanvas } from 'qrcode.react';

const QRGenerator = ({booking_id,action}:{booking_id:string,action:string}) => {
  const valueToEncode = action === 'start' ? `/ride-start/${booking_id}` : `/ride-end/${booking_id}`;

  return (
    <div className='flex flex-col items-center bg-white justify-center p-3 rounded-lg shadow-lg'>
      <h2 className='text-lg font-semibold text-black mb-4'>{action === 'start' ? 'Scan to Start Ride' : 'Scan to End Ride'}</h2>
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
