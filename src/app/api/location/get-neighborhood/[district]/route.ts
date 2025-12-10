import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";
import slugify from "slugify";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ district: string }> }
) {
  const { district } = await params;
  const projectLocations = await prisma.propertyLocation.findMany({
    distinct: ["neighborhood"],
  });

  // console.log(district);

  function capitalize(s: string): string {
    return String(s[0]).toLocaleUpperCase("tr") + String(s).slice(1);
  }
  interface NeighborhoodData {
    neighborhood_id: number;
    label: string;
    value: string;
    district_name: string;
    district_slug: string;
  }
  const data: NeighborhoodData[] = [];

  const neighborhoodData = await prisma.neighborhood.findMany({
    where: { district_name: capitalize(district) },
  });

  if (neighborhoodData) {
    neighborhoodData.forEach((neighborhood) => {
      data.push({
        neighborhood_id: neighborhood.neighborhood_id,
        label: neighborhood.neighborhood_name,
        value: slugify(neighborhood.neighborhood_name, {
          lower: true,
        }),
        district_name: capitalize(
          neighborhood.district_name.toLocaleLowerCase("tr")
        ),
        district_slug: slugify(neighborhood.district_name, {
          lower: true,
        }),
      });
    });
  }

  // console.log(data);

  return NextResponse.json(data);
}
