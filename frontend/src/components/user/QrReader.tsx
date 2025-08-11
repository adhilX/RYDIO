import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { startEndRide } from "@/services/user/rideStartEndService";

export default function QrScanner() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("QR Code:", decodedText);
       startEndRide(decodedText)
      },
      (error) => {
        console.warn(error);
      }
    );

    return () => {
      scanner.clear();
    };
  }, []);

  return <div id="reader" style={{ width: "300px" }}></div>;
}
