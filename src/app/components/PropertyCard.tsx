import { Card } from "@/components/ui/card";
import { Prisma } from "@prisma/client";
import Link from "next/link";

interface Props {
  property: Prisma.PropertyGetPayload<{
    select: {
      id: true;
      name: true;
      price: true;
      images: {
        select: {
          url: true;
        };
      };
      location: {
        select: {
          city: true;
          state: true;
        };
      };
    };
  }>;
}

const PropertyCard = ({ property }: Props) => {
  return (
    <Card className="w-72 flex flex-col hover:scale-105 transition-transform shadow-md rounded-lg overflow-hidden border-0">
      <div className="relative w-full h-48">
        <img
          src={
            property.id === 1
              ? property.images[0].url
              : `/images/${Math.floor(Math.random() * 9 + 1)}.jpg`
          }
          alt={property.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col mt-auto bg-white">
        <div className="p-4">
          <p className="text-primary-600 text-xl font-bold truncate">{property.name}</p>
          <p className="text-slate-600">
            {property.location?.city}, {property.location?.state}
          </p>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-200 p-4 flex justify-between items-center">
          <p className="font-semibold text-lg">${property.price.toLocaleString()}</p>
          <Link
            className="hover:text-primary-500 transition-colors text-sm font-medium"
            href={`/property/${property.id}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
