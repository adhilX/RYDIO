import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState, useRef } from "react";
import { startEndRide } from "@/services/user/rideStartEndService";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function QrScanner() {
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const initializeScanner = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Clear existing scanner instance if any
        if (scannerRef.current) {
          try {
            await scannerRef.current.clear();
          } catch (e) {
            console.warn("Failed to clear previous scanner", e);
          }
        }

        const scanner = new Html5QrcodeScanner(
          "reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true
          },
          false
        );

        scannerRef.current = scanner;

        // Small delay to ensure DOM is ready
        timeoutId = setTimeout(() => {
          if (!scannerRef.current) return;

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
                toast.success("Ride action completed successfully!");
                setError(null);
                clearTimeout(timeoutId);
                // Auto-restart scanning after 3 seconds
                timeoutId = setTimeout(() => {
                  setSuccess(null);
                  setIsScanning(true);
                  setIsLoading(false);
                }, 3000);

              } catch (err) {
                console.error("Error processing QR code:", err);
                setError(err instanceof Error ? err.message : "Failed to process QR code");
                setSuccess(null);
                setIsScanning(false);
                setIsLoading(false);

                // Stop scanning on error - require manual retry
              }
            },
            (error) => {
              // Filter out common scanning errors that occur during normal operation
              const commonErrors = [
                "No QR code found",
                "No MultiFormat Readers were able to detect the code",
                "NotFoundException",
                "QR code parse error"
              ];

              const isCommonError = commonErrors.some(commonError =>
                error.toString().includes(commonError)
              );

              // Only log unexpected errors, not the common scanning errors
              if (!isCommonError) {
                console.warn("QR Scanner error:", error);
              }
            }
          );
          setIsLoading(false);
        }, 100);

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
      clearTimeout(timeoutId);
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
    <div className="w-full max-w-md mx-auto relative overflow-hidden">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Scan QR Code</h3>
        <p className="text-sm text-gray-400">
          Point your camera at the QR code to start/end your ride
        </p>
      </div>

      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-xl relative min-h-[300px] flex flex-col justify-center">
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center rounded-2xl">
            <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
            <p className="text-gray-300 text-sm">{isScanning ? "Initializing camera..." : "Processing..."}</p>
          </div>
        )}

        {error && (
          <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-red-400 font-medium mb-6">{error}</p>
            <Button
              onClick={handleRetry}
              className="bg-white text-black hover:bg-gray-200 font-bold"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {success && (
          <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-xl animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-green-400 font-bold">{success}</p>
          </div>
        )}

        <div
          id="reader"
          className={`w-full overflow-hidden rounded-xl bg-black ${isScanning && !isLoading ? "block" : "hidden"}`}
        />

        {!isScanning && !isLoading && !error && !success && (
          <div className="text-center p-8">
            <Button
              onClick={handleRetry}
              className="bg-white text-black hover:bg-gray-200 font-bold"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Scan Another QR Code
            </Button>
          </div>
        )}
      </div>

      {/* Custom Styles override for html5-qrcode library specific elements if needed */}
      <style>{`
        #reader__scan_region {
            background: rgba(0,0,0,0.5);
        }
        #reader__dashboard_section_csr span {
            display: none !important;
        }
        #reader__dashboard_section_swaplink {
            display: none !important;
        } 
      `}</style>
    </div>
  );
}
