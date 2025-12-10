import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const projectLocations = await prisma.propertyLocation.findMany({
    distinct: ["country"],
  });

  let countries: string[] = [];

  projectLocations.forEach((location) => {
    countries.push(location.country);
  });

  interface CountryData {
    country_id: number;
    country_name: string;
    country_slug: string;
  }
  const data: CountryData[] = [];
  await Promise.all(
    countries.map(async (country) => {
      const countryData = await prisma.country.findFirst({
        where: { country_name: country },
      });

      if (countryData) {
        data.push({
          country_id: countryData.country_id,
          country_name: countryData.country_name,
          country_slug: countryData.slug,
        });
      }
    })
  );

  return NextResponse.json(data);
}
