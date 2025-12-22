
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IdProofAlertModalProps {
    open: boolean;
    onClose: () => void;
}

export function IdProofAlertModal({ open, onClose }: IdProofAlertModalProps) {
    const navigate = useNavigate();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-black/90 border border-white/10 text-white backdrop-blur-xl rounded-3xl">
                <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-6">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2 animate-pulse">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">Identity Verification Required</DialogTitle>
                    <DialogDescription className="text-gray-400 text-base max-w-xs mx-auto">
                        To ensure safety and trust in our community, we require all users to verify their identity before booking vehicles.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 pb-2 w-full">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-1/2 border-white/10 hover:bg-white/5 hover:text-white rounded-xl"
                    >
                        Remind Me Later
                    </Button>
                    <Button
                        onClick={() => {
                            onClose();
                            navigate("/userprofile");
                        }}
                        className="w-full sm:w-1/2 bg-white text-black hover:bg-gray-200 font-bold rounded-xl"
                    >
                        Verify Now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
