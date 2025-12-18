import prisma from "@/lib/prisma";
import AddPropertyForm from "../../add/_components/AddPropertyForm";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getUserById } from "@/lib/actions/user";
import { getUserRole } from "@/lib/auth";

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
    deedStatuses,
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
    prisma.propertyDeedStatus.findMany(),
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
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const role = await getUserRole(user.id);

  const dbUser = await getUserById(user.id);
  console.log("user is:", user);
  console.log("dbuser is:", dbUser);
  console.log("act", role);

  // console.log("db properties", property);

  if (!property) return notFound();
  if (!user || (property.userId !== user.id && role !== "site-admin"))
    redirect("/unauthorized");
  return (
    <AddPropertyForm
      countries={countries}
      cities={cities}
      citiesObj={citiesObj}
      //  districts={districts}
      // districtsObj={districtsObj}
      // neighborhoods={neighborhoods}
      // neighborhoodsObj={neighborhoodsObj}
      role={role || ""}
      agents={agents}
      types={propertyTypes}
      subTypes={propertySubTypes}
      statuses={propertyStatuses}
      contracts={propertyContracts}
      deedStatuses={deedStatuses}
      property={property}
      isEdit={true}
      // descriptorCategories={descriptorCategories}
    />
  );
};
export default EditPropertyPage;
