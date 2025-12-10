import prisma from "@/lib/prisma";
import AddPropertyForm from "../../add/_components/AddPropertyForm";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser, getUserRole } from "@/lib/auth";

interface Props {
  params: { id: string };
}

const EditPropertyPage = async ({ params }: Props) => {
  const [
    propertyTypes,
    propertySubTypes,
    propertyStatuses,
    propertyContracts,
    property,
    agents,
    countries,
    cities,
    // districts,
    //  neighborhoods,
    // descriptorCategories,
  ] = await Promise.all([
    prisma.propertyType.findMany(),
    prisma.propertySubType.findMany(),
    prisma.propertyStatus.findMany(),
    prisma.propertyContract.findMany(),
    prisma.property.findUnique({
      where: {
        id: +params.id,
      },
      include: {
        location: true,
        feature: true,
        agent: true,
        images: true,
        descriptors: true,
      },
    }),
    prisma.officeWorker.findMany({
      where: {
        roleId: { in: [7, 6] },
      },
    }),
    prisma.country.findMany(),
    prisma.city.findMany(),
    // prisma.district.findMany(),
    //  prisma.neighborhood.findMany(),
    // prisma.propertyDescriptorCategory.findMany({
    //   include: { descriptors: true },
    // }),
  ]);

  let citiesObj: Record<string, string[]> = {};

  for (const country of countries) {
    const citiesData = await prisma.city.findMany({
      where: {
        country_id: country.country_id,
      },
    });
    const cityNames = citiesData.map((city) => city.city_name);
    citiesObj[country.country_name] = cityNames;
  }

  // let districtsObj: Record<string, string[]> = {};
  // for (const city of cities) {
  //   const districtData = await prisma.district.findMany({
  //     where: {
  //       city_name: city.city_name,
  //     },
  //   });
  //   const districtNames = districtData.map(
  //     (district) => district.district_name
  //   );

  //   districtsObj[city.city_name] = districtNames;
  // }

  // let neighborhoodsObj: Record<string, string[]> = {};
  // for (const district of districts) {
  //   const neighborhoodsData = await prisma.neighborhood.findMany({
  //     where: {
  //       district_name: district.district_name,
  //     },
  //   });
  //   const neighborhoodNames = neighborhoodsData.map(
  //     (neighborhood) => neighborhood.neighborhood_name
  //   );

  //   neighborhoodsObj[district.district_name] = neighborhoodNames;
  // }
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const { dbUser } = currentUser;
  const role = await getUserRole(dbUser.id);

  if (!property) return notFound();
  if (property.userId !== dbUser.id) redirect("/unauthorized");
  return (
    <AddPropertyForm
      countries={countries}
      cities={cities}
      citiesObj={citiesObj}
      //  districts={districts}
      // districtsObj={districtsObj}
      // neighborhoods={neighborhoods}
      // neighborhoodsObj={neighborhoodsObj}
      role={role ?? ""}
      agents={agents}
      types={propertyTypes}
      subTypes={propertySubTypes}
      statuses={propertyStatuses}
      contracts={propertyContracts}
      property={property}
      isEdit={true}
      // descriptorCategories={descriptorCategories}
    />
  );
};
export default EditPropertyPage;
