import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { LeafletMouseEvent } from "leaflet";

interface StepThreeProps {
  onSubmit: (data: StepThreeFormData) => void;
  defaultValues?: StepThreeFormData;
}

export interface StepThreeFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  pincode: Yup.string().required("Pincode is required"),
  latitude: Yup.number().required(),
  longitude: Yup.number().required(),
});

export default function StepThree({ onSubmit, defaultValues }: StepThreeProps) {
  const [marker, setMarker] = useState<[number, number]>([
    defaultValues?.latitude || 9.9354,
    defaultValues?.longitude || 76.2710,
  ]);

  const [btnOn,setBtnOn]= useState(false)

  const handleMapClick = async (e: LeafletMouseEvent, setFieldValue: FormikHelpers<StepThreeFormData>["setFieldValue"]) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      const address = data.address || {};

      setFieldValue("latitude", lat);
      setFieldValue("longitude", lng);
      setFieldValue("address", data.display_name || "");
      setFieldValue("city", address.city || address.town || address.village || "");
      setFieldValue("state", address.state || "");
      setFieldValue("country", address.country || "");
      setFieldValue("pincode", address.postcode || "");
      setMarker([lat, lng]);
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  const MapClickHandler = ({ setFieldValue }: { setFieldValue: FormikHelpers<StepThreeFormData>["setFieldValue"]; }) => {
    useMapEvents({ click: (e) => handleMapClick(e, setFieldValue) });
    return null;
  };

  const conform = (values:StepThreeFormData)=>{
      onSubmit(values)
     setBtnOn(true)
  }

  return (
    <Formik
      initialValues={
        defaultValues || {
          name: "",
          address: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
          latitude: 9.9354,
          longitude: 76.2710,
        }
      }
      validationSchema={validationSchema}
      onSubmit={(values) => conform(values)  }
    >
      {({ setFieldValue }) => (
        <Form className="space-y-4 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Location Name</label>
              <Field
                name="name"
                as={Input}
                placeholder="e.g. Cochin Airport"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block mb-1">Address</label>
              <Field
                name="address"
                as={Input}
                readOnly
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block mb-1">City</label>
              <Field name="city" as={Input} readOnly />
              <ErrorMessage
                name="city"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block mb-1">State</label>
              <Field name="state" as={Input} readOnly />
              <ErrorMessage
                name="state"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block mb-1">Country</label>
              <Field name="country" as={Input} readOnly />
              <ErrorMessage
                name="country"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block mb-1">Pincode</label>
              <Field name="pincode" as={Input} readOnly />
              <ErrorMessage
                name="pincode"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>
          </div>

          <div className="h-96 rounded overflow-hidden">
            <MapContainer
              center={marker}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='© OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler setFieldValue={setFieldValue} />
              <Marker position={marker} />
            </MapContainer>
          </div>

          <div className="pt-4 text-right">
           {btnOn?<></>:(<Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Confirm Location
            </Button>)}
          </div>
        </Form>
      )}
    </Formik>
  );
}
