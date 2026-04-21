"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <span className="material-icons text-mosque/30 animate-pulse text-4xl">map</span>
    </div>
  ),
});

interface MapWrapperProps {
  locationString: string;
}

export default function MapWrapper({ locationString }: MapWrapperProps) {
  return <PropertyMap locationString={locationString} />;
}
