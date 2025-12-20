import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getCroppedImg } from "@/lib/utils/cropImage"
import type { CroppedAreaPixels } from "@/Types/User/Cropper/IcropperArea"
import { Dialog } from "@radix-ui/react-dialog"
import { Crop as CropIcon, ZoomIn } from "lucide-react"

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedImage: File | null) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  aspect?: number
}

export function ImageCropper({
  imageSrc,
  onCropComplete,
  open,
  onOpenChange,
  aspect = 1,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number }>({ height: 0, width: 0, x: 0, y: 0 })

  const handleCropComplete = useCallback((_: { x: number, y: number }, croppedPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleSave = async () => {
    try {
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels)
      onCropComplete(cropped)
      onOpenChange(false)
    } catch (error) {
      console.error("Error cropping image:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-lg bg-black/80 backdrop-blur-xl border border-white/10 text-white rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.1)] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-center text-white flex items-center justify-center gap-2">
            <CropIcon className="w-5 h-5" />
            Adjust Image
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="relative w-full h-72 bg-black/50 rounded-2xl overflow-hidden border border-white/10 shadow-inner">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              classes={{
                containerClassName: "bg-black/50",
                mediaClassName: "",
                cropAreaClassName: "border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 px-2">
              <ZoomIn className="w-4 h-4 text-gray-400" />
              <Input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(+e.target.value)}
                className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-gray-200"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-xl border-white/10 text-white hover:bg-white/5 hover:text-white h-12"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-white text-black hover:bg-gray-200 font-bold h-12 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}