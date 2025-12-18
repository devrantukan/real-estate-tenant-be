import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";
import slugify from "slugify";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ city: string; districtId: string }> }
) {
  const { city, districtId } = await params;
  const neighborhoods = await prisma.neighborhood.findMany({
    where: {
      city_id: parseInt(city),
      district_id: parseInt(districtId),
    },
    orderBy: {
      neighborhood_name: "asc",
    },
  });

  const neighborhoodNames = neighborhoods.map((neighborhood) => ({
    neighborhood_id: neighborhood.neighborhood_id,
    neighborhood_name: neighborhood.neighborhood_name,
  }));
  // districtsObj[params.city] = districtNames;

  // console.log(JSON.stringify(districtsObj));

  return NextResponse.json(neighborhoodNames);
}
