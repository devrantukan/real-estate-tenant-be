import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // Site-admin rolünü kontrol et veya oluştur
    let siteAdminRole = await prisma.role.findFirst({
      where: { slug: "site-admin" },
    });

    if (!siteAdminRole) {
      siteAdminRole = await prisma.role.create({
        data: {
          title: "Site Admin",
          slug: "site-admin",
        },
      });
    }

    return NextResponse.json({
      success: true,
      role: siteAdminRole,
      message: `Site-admin rolü ${siteAdminRole.id} ID ile oluşturuldu/güncellendi.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

