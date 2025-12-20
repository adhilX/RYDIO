import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { LeafletMouseEvent } from "leaflet";
import { findLocation } from "@/services/user/locationService";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

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
const StepThree = ({ onSubmit, defaultValues }: StepThreeProps) => {
    const [marker, setMarker] = useState<[number, number]>([
        defaultValues?.latitude || 9.9354,
        defaultValues?.longitude || 76.2710,
    ]);

    const location = useSelector((state: RootState) => state.location);
    const [btnOn, setBtnOn] = useState(false)

    const handleMapClick = async (e: LeafletMouseEvent, setFieldValue: FormikHelpers<StepThreeFormData>["setFieldValue"], validateForm: () => void) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;


        const data = await findLocation(lat, lng)
        const address = data.address || {};

        setFieldValue("latitude", lat);
        setFieldValue("longitude", lng);
        setFieldValue("address", data.display_name || "");
        setFieldValue("city", address.city || address.town || address.village || "");
        setFieldValue("state", address.state || "");
        setFieldValue("country", address.country || "");
        setFieldValue("pincode", address.postcode || "");
        setMarker([lat, lng]);
        validateForm();


    };

    const MapClickHandler = ({ setFieldValue, validateForm }: { setFieldValue: FormikHelpers<StepThreeFormData>["setFieldValue"]; validateForm: () => void; }) => {
        useMapEvents({ click: (e) => handleMapClick(e, setFieldValue, validateForm) });
        return null;
    };

    const conform = (values: StepThreeFormData) => {
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
            onSubmit={(values) => conform(values)}
            validateOnChange={false}
        >
            {({ setFieldValue, validateForm, values, setValues }) => {
                const fetchCurrentLocation = async () => {
                    if (!location?.latitude || !location?.longitude) return;

                    try {
                        const data = await findLocation(location.latitude, location.longitude);
                        const address = data.address || {};

                        const newValues: StepThreeFormData = {
                            ...values,
                            latitude: location.latitude,
                            longitude: location.longitude,
                            address: data.display_name || "",
                            city: address.city || address.town || address.village || "",
                            state: address.state || "",
                            country: address.country || "",
                            pincode: address.postcode || "",
                        };

                        setValues(newValues);
                        setMarker([location.latitude, location.longitude]);


                    } catch (error) {
                        console.error("Error fetching location:", error);
                    }
                }
                return (
                    <Form className="space-y-8 font-sans">
                        <div className="space-y-4">
                            <div className="h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
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
                                    <MapClickHandler setFieldValue={setFieldValue} validateForm={validateForm} />
                                    <Marker position={marker} />
                                </MapContainer>

                                <div className="absolute top-4 right-4 z-[1000]">
                                    <button
                                        type="button"
                                        onClick={fetchCurrentLocation}
                                        className="bg-white text-black font-bold py-2.5 px-4 rounded-xl shadow-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Use Current Location
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location Name</label>
                                <Field
                                    name="name"
                                    as={Input}
                                    placeholder="e.g. Cochin Airport"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium"
                                />
                                <ErrorMessage name="name" component="div" className="text-xs text-red-400 font-medium" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</label>
                                <Field
                                    name="address"
                                    as={Input}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium"
                                />
                                <ErrorMessage name="address" component="div" className="text-xs text-red-400 font-medium" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">City</label>
                                <Field name="city" as={Input} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium" />
                                <ErrorMessage name="city" component="div" className="text-xs text-red-400 font-medium" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">State</label>
                                <Field name="state" as={Input} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium" />
                                <ErrorMessage name="state" component="div" className="text-xs text-red-400 font-medium" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Country</label>
                                <Field name="country" as={Input} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium" />
                                <ErrorMessage name="country" component="div" className="text-xs text-red-400 font-medium" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pincode</label>
                                <Field name="pincode" as={Input} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium" />
                                <ErrorMessage name="pincode" component="div" className="text-xs text-red-400 font-medium" />
                            </div>
                        </div>


                        <div className="pt-8 flex justify-end border-t border-white/5">
                            {btnOn ? <span className="text-green-400 font-medium flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                Location Confirmed
                            </span> : (
                                <Button type="submit" className="bg-white text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all duration-200">
                                    Confirm Location
                                </Button>
                            )}
                        </div>
                    </Form>
                )
            }}
        </Formik>
    );
}
export default React.memo(StepThree);