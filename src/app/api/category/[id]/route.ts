import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const category = await prisma.propertyDescriptorCategory.findFirst({
    where: {
      id: +id,
    },
    include: {
      descriptors: true,
    },
  });
  //console.log(category);

  return NextResponse.json(category);
}
