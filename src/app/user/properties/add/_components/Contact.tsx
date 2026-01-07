import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from "@heroicons/react/16/solid";
import {
  Card,
  cn,
} from "@heroui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { AddPropertyInputType } from "./AddPropertyForm";
import { OfficeWorker, PropertyDescriptorCategory, User } from "@prisma/client";

import axios from "axios";
// Removed Kinde import - using Supabase auth instead

interface Props {
  prev: () => void;
  className?: string;
  agents: OfficeWorker[];
  role: string;
  user: User;
  // descriptorCategories: any[];
  dbDescriptors: any[];
}
const Contact = ({
  prev,
  className,
  agents,
  role,
  user,
  // descriptorCategories,
  dbDescriptors,
}: Props) => {
  const {
    register,
    formState: { errors },
    control,
    getValues,
    setValue,
    watch,
  } = useFormContext<AddPropertyInputType>();

  const [agentId, setAgentId] = React.useState<number>(0);
  const [descriptors, setDescriptors] = React.useState<any[]>([]);

  const [descriptorCategories, setDescriptorCategories] = React.useState<any[]>(
    []
  );

  useEffect(() => {
    const values = getValues();
    if (values.agentId) {
      setAgentId(Number(values.agentId));
    }
  }, [getValues]);
  const typeId = getValues().typeId;
  useEffect(() => {
    const values = getValues();
    if (values.typeId) {
      fetchDescriptors(Number(values.typeId));
    }
  }, [typeId, getValues]);

  async function fetchDescriptors(typeId: number) {
    try {
      if (!typeId) return;

      const response = await axios.get(
        `/api/property/get-property-descriptor-categories/${typeId}`
      );
      setDescriptorCategories(response.data);
    } catch (error) {
      console.error("Error fetching descriptors:", error);
      console.error("Failed typeId:", typeId);
    }
  }

  const [selectedTypeId, setSelectedTypeId] = React.useState(typeId);

  const [descriptorsGrouped, setDescriptorsGrouped] = React.useState<
    Record<string, any[]>
  >({});

  const propertyDescriptors = getValues().propertyDescriptors;

  let descriptorsList: number[] = [];
  dbDescriptors?.forEach((descriptor) => {
    if (descriptor && descriptor.descriptorId) {
      descriptorsList.push(descriptor.descriptorId);
    }
  });

  // Debug
  // console.log("dbDescriptors:", dbDescriptors);
  // console.log("descriptorsList:", descriptorsList);

  // const { user } = useKindeBrowserClient();
  //console.log("user is qwdqwe:", user);
  const currentAgent = agents.find((agent) => agent.userId === user?.id);

  useEffect(() => {
    if (currentAgent) {
      setValue("agentId", currentAgent.id);
    }
  }, [currentAgent, setValue]);

  return (
    <Card className={cn("pb-2", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-2">
        {role == "office-workers" && (
          <Input
            type="hidden"
            {...register("agentId", {
              valueAsNumber: true,
              value: Number(currentAgent?.id),
            })}
            className="hidden"
          />
        )}
        {role == "site-admin" && (
          <div className="space-y-2 col-span-1">
            <Label>Gayrimenkul Danışmanı</Label>
            <Select
              onValueChange={(v) => setValue("agentId", Number(v))}
              value={watch("agentId")?.toString() || ""}
            >
              <SelectTrigger className={errors.agentId ? "border-red-500" : ""}>
                <SelectValue placeholder="Danışman seçin" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name} {item.surname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.agentId && (
              <p className="text-xs text-red-500 font-medium">{errors.agentId.message}</p>
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {descriptorCategories &&
          descriptorCategories
            .filter((descriptorCategory) => descriptorCategory.typeId == typeId)
            .map((descriptorCategory) => (
              <div key={descriptorCategory.id} className="flex flex-col gap-3">
                <h2 className="text-lg font-bold border-b pb-2">
                  {descriptorCategory.value}
                </h2>
                <div className="flex flex-col gap-2">
                  {descriptorCategory.descriptors &&
                    descriptorCategory.descriptors.map(
                      (descriptor: {
                        id: string | number;
                        value: string;
                        slug: string;
                      }) => (
                        <div key={descriptor.id} className="flex items-center space-x-2">
                          <Controller
                            control={control}
                            name={`propertyDescriptors.${descriptor.slug}` as any}
                            defaultValue={descriptorsList.includes(
                              Number(descriptor.id)
                            )}
                            render={({ field }) => (
                              <Checkbox
                                id={String(descriptor.id)}
                                checked={
                                  field.value ||
                                  descriptorsList.includes(Number(descriptor.id))
                                }
                                onCheckedChange={field.onChange}
                              />
                            )}
                          />
                          <Label
                            htmlFor={String(descriptor.id)}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {descriptor.value}
                          </Label>
                        </div>
                      )
                    )}
                </div>
              </div>
            ))}
      </div>

      <div className="flex justify-center col-span-3 gap-3">
        <Button
          onClick={prev}
          variant="outline"
          className="w-36"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Geri
        </Button>
        <Button
          className="w-36"
          type="submit"
        >
          <PlusCircleIcon className="w-5 h-5 mr-1" />
          Kaydet
        </Button>
      </div>
    </Card>
  );
};
export default Contact;
