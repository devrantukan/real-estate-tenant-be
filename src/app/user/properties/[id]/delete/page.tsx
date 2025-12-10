import { deleteProperty } from "@/lib/actions/property";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import DeletePropertyContent from "./_components/DeletePropertyContent";

interface Props {
  params: { id: string };
}

async function DeletePropertyPage({ params }: Props) {
  const currentUser = await getCurrentUser();
  const propertyPromise = prisma.property.findUnique({
    where: {
      id: +params.id,
    },
  });
  const [property] = await Promise.all([propertyPromise]);

  if (!property) return notFound();
  if (!currentUser || property.userId !== currentUser.dbUser.id) redirect("/unauthorized");

  const deleteAction = async () => {
    "use server";
    try {
      await deleteProperty(+params.id);
      redirect("/user/properties");
    } catch (e) {
      throw e;
    }
  };

  return <DeletePropertyContent propertyName={property.name} deleteAction={deleteAction} />;
}

export default DeletePropertyPage;
