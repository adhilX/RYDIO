import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState, useRef } from "react";
import { startEndRide } from "@/services/user/rideStartEndService";

export default function QrScanner() {
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const scanner = new Html5QrcodeScanner(
          "reader",
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          false
        );

        scannerRef.current = scanner;

        scanner.render(
          async (decodedText, decodedResult) => {
            console.log("Scanned text:", decodedText);
            console.log("Full result:", decodedResult);
            
            setIsScanning(false);
            setIsLoading(true);
            
            try {
              // Validate QR code format - should be a URL or valid endpoint
              if (!decodedText.trim()) {
                throw new Error("Empty QR code detected");
              }

              await startEndRide(decodedText);
              setSuccess("Ride action completed successfully!");
              setError(null);
              
              // Auto-restart scanning after 3 seconds
              setTimeout(() => {
                setSuccess(null);
                setIsScanning(true);
                setIsLoading(false);
              }, 3000);
              
            } catch (err) {
              console.error("Error processing QR code:", err);
              setError(err instanceof Error ? err.message : "Failed to process QR code");
              setSuccess(null);
              
              // Auto-restart scanning after 3 seconds
              setTimeout(() => {
                setError(null);
                setIsScanning(true);
                setIsLoading(false);
              }, 3000);
            }
          }, 
          (error) => {
            // Only log scanning errors, don't show them to user as they're frequent
            if (!error.includes("No QR code found")) {
              console.warn("QR Scanner error:", error);
            }
          }
        );

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize scanner:", err);
        setError("Failed to initialize camera. Please check permissions.");
        setIsLoading(false);
      }
    };

    if (isScanning) {
      initializeScanner();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => 
          console.error("Scanner cleanup failed:", err)
        );
        scannerRef.current = null;
      }
    };
  }, [isScanning]);

  const handleRetry = () => {
    setError(null);
    setSuccess(null);
    setIsScanning(true);
  };

  return (
    <div className="qr-scanner-container" style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
      <div className="scanner-header" style={{ marginBottom: "16px", textAlign: "center" }}>
        <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>Scan QR Code</h3>
        <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
          Point your camera at the QR code to start/end your ride
        </p>
      </div>

      {isLoading && (
        <div style={{ 
          textAlign: "center", 
          padding: "20px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px",
          marginBottom: "16px"
        }}>
          <div style={{ fontSize: "14px", color: "#666" }}>
            {isScanning ? "Initializing camera..." : "Processing QR code..."}
          </div>
        </div>
      )}

      {error && (
        <div style={{ 
          padding: "12px", 
          backgroundColor: "#fee", 
          border: "1px solid #fcc", 
          borderRadius: "8px",
          marginBottom: "16px",
          textAlign: "center"
        }}>
          <div style={{ color: "#c33", fontSize: "14px", marginBottom: "8px" }}>
            {error}
          </div>
          <button 
            onClick={handleRetry}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {success && (
        <div style={{ 
          padding: "12px", 
          backgroundColor: "#efe", 
          border: "1px solid #cfc", 
          borderRadius: "8px",
          marginBottom: "16px",
          textAlign: "center",
          color: "#363",
          fontSize: "14px"
        }}>
          {success}
        </div>
      )}

      <div 
        id="reader" 
        style={{ 
          width: "100%",
          display: isScanning && !isLoading ? "block" : "none"
        }}
      />

      {!isScanning && !isLoading && !error && !success && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <button 
            onClick={handleRetry}
            style={{
              padding: "12px 24px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Scan Another QR Code
          </button>
        </div>
      )}
    </div>
  );
}
