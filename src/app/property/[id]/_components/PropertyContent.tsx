"use client";

import { Card } from "@nextui-org/react";
import { ImagesSlider } from "@/app/components/ImageSlider";

interface PropertyContentProps {
  property: {
    name: string;
    price: number;
    description: string;
    status: { value: string };
    feature: {
      bedrooms?: number;
      bathrooms?: number;
      floor?: number;
      area?: number;
    } | null;
    location: {
      city?: string;
      landmark?: string;
      zip?: string;
      streetAddress?: string;
    } | null;
  };
  images: string[];
}

export default function PropertyContent({ property, images }: PropertyContentProps) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary my-5">
        {property.name}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="col-span-2">
          <ImagesSlider images={images} />
          <h2 className="text-2xl font-bold text-gray-700 mt-7">
            $ {property.price} / {property.status.value}
          </h2>

          <p className="text-sm text-slate-600 mt-7">
            {property.description}
          </p>
        </div>
        <Card className="p-5 flex flex-col gap-1">
          <Title title="Features" />
          <Attribute label="Bedrooms" value={property.feature?.bedrooms} />
          <Attribute label="Bathrooms" value={property.feature?.bathrooms} />
          <Attribute label="Bulunduğu kat" value={property.feature?.floor} />
          <Attribute label="Area" value={property.feature?.area} />

          <Title title="Address" className="mt-7" />
          <Attribute label="City" value={property.location?.city} />
          <Attribute label="Landmarks" value={property.location?.landmark} />
          <Attribute label="Zip Code" value={property.location?.zip} />
          <Attribute
            label="Address"
            value={property.location?.streetAddress}
          />
        </Card>
      </div>
    </div>
  );
}

const Title = ({ title, className }: { title: string; className?: string }) => (
  <div className={className}>
    <h2 className="text-xl font-bold text-slate-700">{title} </h2>
    <hr className="boreder border-solid border-slate-300" />
  </div>
);

const Attribute = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="flex justify-between">
    <span className="text-sm text-slate-600">{label}</span>
    <span className="text-sm text-slate-600">{value}</span>
  </div>
);
