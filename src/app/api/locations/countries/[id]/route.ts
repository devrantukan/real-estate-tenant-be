import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { NextResponse } from "next/server";
import { CountrySchema } from "@/lib/validations/location";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getUserRole(user.id);
    if (role !== "site-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = CountrySchema.parse(body);

    const { id } = await params;
    const country = await prisma.country.update({
      where: { country_id: parseInt(id) },
      data: {
        country_name: validatedData.country_name,
        slug: validatedData.slug,
      },
    });

    return NextResponse.json(country);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu kayıt zaten mevcut" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getUserRole(user.id);
    if (role !== "site-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.country.delete({
      where: { country_id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Bu ülkeye bağlı kayıtlar olduğu için silinemez" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
