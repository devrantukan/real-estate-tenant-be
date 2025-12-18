import { prisma } from "@/lib/prisma";
import ProjectForm from "../_components/ProjectForm";
import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const role = await getUserRole(user.id);
  if (role !== "site-admin") {
    redirect("/");
  }

  const offices = await prisma.office.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const agents = await prisma.officeWorker.findMany({
    select: {
      id: true,
      name: true,
      surname: true,
      officeId: true,
      role: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  const countries = await prisma.country.findMany({
    select: {
      country_name: true,
    },
  });

  const cities = await prisma.city.findMany({
    select: {
      city_name: true,
    },
  });

  const citiesObj = await prisma.country
    .findMany({
      select: {
        country_name: true,
        cities: {
          select: {
            city_name: true,
          },
        },
      },
    })
    .then((countries) =>
      countries.reduce(
        (acc, country) => ({
          ...acc,
          [country.country_name]: country.cities.map((city) => city.city_name),
        }),
        {}
      )
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Yeni Proje</h1>
      <ProjectForm
        offices={offices}
        agents={agents}
        countries={countries}
        cities={cities}
        citiesObj={citiesObj}
      />
    </div>
  );
}
