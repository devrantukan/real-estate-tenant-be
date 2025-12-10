import React from "react";
import AddPropertyForm from "./_components/AddPropertyForm";
import prisma from "@/lib/prisma";
import { getCurrentUser, getUserRole } from "@/lib/auth";
import { getUserById } from "@/lib/actions/user";
import { redirect } from "next/navigation";

const AddPropertyPage = async () => {
  const [
    propertyTypes,
    propertySubTypes,
    propertyStatuses,
    propertyContracts,
    agents,
    countries,
    cities,
    districts,
    // neighborhoods,
    // descriptorCategories,
  ] = await Promise.all([
    prisma.propertyType.findMany(),
    prisma.propertySubType.findMany(),
    prisma.propertyStatus.findMany(),
    prisma.propertyContract.findMany(),
    prisma.officeWorker.findMany(),
    prisma.country.findMany(),
    prisma.city.findMany(),
    // prisma.district.findMany(),
    // prisma.neighborhood.findMany(),
    prisma.propertyDescriptorCategory.findMany({
      include: { descriptors: true },
    }),
  ]);

  let citiesObj: Record<string, string[]> = {};

  for (const country of countries) {
    const citiesData = await prisma.city.findMany({
      where: {
        country_name: country.country_name,
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
  //   //  console.log(neighborhoodsData);
  //   const neighborhoodNames = neighborhoodsData.map(
  //     (neighborhood) => neighborhood.neighborhood_name
  //   );
  //   // console.log(neighborhoodNames);
  //   neighborhoodsObj[district.district_name] = neighborhoodNames;
  // }

  //console.log(neighborhoodsObj);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const { dbUser } = currentUser;
  const role = await getUserRole(dbUser.id);

  //console.log("contracts", propertyContracts);
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
      // descriptorCategories={descriptorCategories}
    />
  );
};
export default AddPropertyPage;
