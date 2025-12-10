import { ImagesSlider } from "@/app/components/ImageSlider";
import PageTitle from "@/app/components/pageTitle";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PropertyContent from "./_components/PropertyContent";

const images = [1, 2, 3, 4, 5, 6].map((image) => `/images/${image}.jpg`);

interface Props {
  params: {
    id: string;
  };
}

const PropertyPage = async ({ params }: Props) => {
  const property = await prisma.property.findUnique({
    where: {
      id: +params.id,
    },
    include: {
      status: true,
      feature: true,
      location: true,
      agent: true,
      images: true,
    },
  });
  if (!property) return notFound();
  
  return (
    <div>
      <PageTitle
        title="Property Page"
        href="/"
        linkCaption="Back to Properties"
      />
      <PropertyContent property={property} images={images} />
    </div>
  );
};

export default PropertyPage;
