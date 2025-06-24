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

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedImage: File | null) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageCropper({
  imageSrc,
  onCropComplete,
  open,
  onOpenChange,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number }>({height:0,width:0,x:0,y:0})

  const handleCropComplete = useCallback((_:{x:number,y:number}, croppedPixels:CroppedAreaPixels) => {
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
      <DialogContent className="w-[90vw] max-w-lg bg-white text-gray-900 border border-gray-200 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Crop Profile Image</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <Input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(+e.target.value)}
            className="w-2/3 bg-gray-100 accent-gray-900"
          />
          <Button
            onClick={handleSave}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}