"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyShare from "./PropertyShare";
import ProjectShare from "./ProjectShare";
import { Prisma } from "@prisma/client";

interface TabsWrapperProps {
  user: {
    id: string;
    officeWorkerId: number;
    slug: string;
  };
  initialData?: {
    projects: {
      id: number;
      name: string;
      description: string;
      catalogUrl: string | null;
      createdAt: Date;
      updatedAt: Date;
      location: {
        city: string;
        district: string;
        neighborhood: string;
      } | null;
    }[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
    searchTerm: string;
  };
}

export default function TabsWrapper({ user, initialData }: TabsWrapperProps) {
  return (
    <Tabs defaultValue="properties" className="mb-8 w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="properties">Emlaklar</TabsTrigger>
        <TabsTrigger value="projects">Projeler</TabsTrigger>
      </TabsList>
      <TabsContent value="properties">
        <PropertyShare user={user} />
      </TabsContent>
      <TabsContent value="projects">
        <ProjectShare user={user} initialData={initialData} />
      </TabsContent>
    </Tabs>
  );
}
