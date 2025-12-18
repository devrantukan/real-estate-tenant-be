import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { publishingStatus } = body;

    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: { publishingStatus },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Proje güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
