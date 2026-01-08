"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { AddPropertyInputType } from "./AddPropertyForm";
import { PropertySubType } from "@prisma/client";

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
  subTypes: PropertySubType[];
}

const Features = (props: Props) => {
  const bedrooms = [
    { id: 1, value: "1+0" },
    { id: 2, value: "1+1" },
    { id: 3, value: "2+1" },
    { id: 4, value: "2+2" },
    { id: 5, value: "3+1" },
    { id: 6, value: "3+2" },
    { id: 7, value: "4+1" },
    { id: 8, value: "4+2" },
    { id: 9, value: "5+1" },
    { id: 10, value: "5+2" },
    { id: 11, value: "6+1" },
    { id: 12, value: "6+2" },
  ];
  const bathrooms = [
    { id: 1, value: "1" },
    { id: 2, value: "2" },
    { id: 3, value: "3" },
    { id: 4, value: "4" },
  ];
  const {
    register,
    formState: { errors },
    control,
    trigger,
    getValues,
    watch,
    setValue,
  } = useFormContext<AddPropertyInputType>();

  // Watch for subTypeId and typeId changes
  const subTypeId = watch("subTypeId");
  const typeId = watch("typeId");
  const isMustakilEv = Number(subTypeId) === 5;
  const isType3 = Number(typeId) === 3;

  // Set default values for floor and totalFloor if it's a Müstakil ev
  useEffect(() => {
    if (isMustakilEv) {
      setValue("propertyFeature.floor", 0);
      setValue("propertyFeature.totalFloor", 0);
    }
  }, [isMustakilEv, setValue]);

  const handleNext = async () => {
    // Always ensure floor values are set to 0 for Müstakil ev
    if (isMustakilEv) {
      setValue("propertyFeature.floor", 0);
      setValue("propertyFeature.totalFloor", 0);
    }

    // Different validation rules based on typeId
    const fieldsToValidate = isType3
      ? [
        "propertyFeature.area" as const,
        "propertyFeature.parcelNumber" as const,
        "propertyFeature.blockNumber" as const,
      ]
      : [
        "propertyFeature.area" as const,
        "propertyFeature.bathrooms" as const,
        "propertyFeature.bedrooms" as const,
        "propertyFeature.floor" as const,
        "propertyFeature.totalFloor" as const,
      ];

    if (await trigger(fieldsToValidate)) {
      props.next();
    }
  };

  return (
    <Card className={cn("p-4 flex flex-col gap-6", props.className)}>
      <div className="flex lg:flex-row flex-col gap-6">
        <div className="lg:w-1/2 w-full flex flex-col gap-5">
          {!isType3 && (
            <>
              <div className="space-y-2">
                <Label>Oda sayısı</Label>
                <Controller
                  name="propertyFeature.bedrooms"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value}
                      onValueChange={onChange}
                    >
                      <SelectTrigger className={errors.propertyFeature?.bedrooms ? "border-red-500" : ""}>
                        <SelectValue placeholder="Oda sayısı seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {bedrooms.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.propertyFeature?.bedrooms && (
                  <p className="text-xs text-red-500 font-medium">{errors.propertyFeature.bedrooms.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Banyo Sayısı</Label>
                <Controller
                  name="propertyFeature.bathrooms"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value}
                      onValueChange={onChange}
                    >
                      <SelectTrigger className={errors.propertyFeature?.bathrooms ? "border-red-500" : ""}>
                        <SelectValue placeholder="Banyo sayısı seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {bathrooms.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.propertyFeature?.bathrooms && (
                  <p className="text-xs text-red-500 font-medium">{errors.propertyFeature.bathrooms.message}</p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Net Alan (m²)</Label>
            <Input
              {...register("propertyFeature.area", { valueAsNumber: true })}
              type="number"
              className={errors.propertyFeature?.area ? "border-red-500" : ""}
              defaultValue={getValues().propertyFeature?.area?.toString() ?? ""}
            />
            {errors.propertyFeature?.area && (
              <p className="text-xs text-red-500 font-medium">{errors.propertyFeature.area.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Brüt Alan (m²)</Label>
            <Input
              {...register("propertyFeature.grossArea", { valueAsNumber: true })}
              type="number"
              className={errors.propertyFeature?.grossArea ? "border-red-500" : ""}
              defaultValue={
                getValues().propertyFeature?.grossArea?.toString() ?? ""
              }
            />
            {errors.propertyFeature?.grossArea && (
              <p className="text-xs text-red-500 font-medium">{errors.propertyFeature.grossArea.message}</p>
            )}
          </div>
        </div>

        <div className="lg:w-1/2 w-full flex flex-col gap-5">
          {!isMustakilEv && !isType3 && (
            <>
              <div className="space-y-2">
                <Label>Bulunduğu Kat</Label>
                <Input
                  {...register("propertyFeature.floor", { valueAsNumber: true })}
                  type="number"
                  className={errors.propertyFeature?.floor ? "border-red-500" : ""}
                  defaultValue={getValues().propertyFeature?.floor?.toString() ?? ""}
                />
                {errors.propertyFeature?.floor && (
                  <p className="text-xs text-red-500 font-medium">{errors.propertyFeature.floor.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Binadaki kat sayısı</Label>
                <Input
                  {...register("propertyFeature.totalFloor", {
                    valueAsNumber: true,
                  })}
                  type="number"
                  className={errors.propertyFeature?.totalFloor ? "border-red-500" : ""}
                  defaultValue={getValues().propertyFeature?.totalFloor?.toString() ?? ""}
                />
                {errors.propertyFeature?.totalFloor && (
                  <p className="text-xs text-red-500 font-medium">{errors.propertyFeature.totalFloor.message}</p>
                )}
              </div>
            </>
          )}

          {isType3 && (
            <>
              <div className="space-y-2">
                <Label>Parsel Numarası</Label>
                <Input
                  {...register("propertyFeature.parcelNumber", {
                    valueAsNumber: true,
                  })}
                  type="number"
                  className={errors.propertyFeature?.parcelNumber ? "border-red-500" : ""}
                  defaultValue={getValues().propertyFeature?.parcelNumber?.toString() ?? ""}
                />
                {errors.propertyFeature?.parcelNumber && (
                  <p className="text-xs text-red-500 font-medium">{errors.propertyFeature.parcelNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Ada Numarası</Label>
                <Input
                  {...register("propertyFeature.blockNumber", {
                    valueAsNumber: true,
                  })}
                  type="number"
                  className={errors.propertyFeature?.blockNumber ? "border-red-500" : ""}
                  defaultValue={getValues().propertyFeature?.blockNumber?.toString() ?? ""}
                />
                {errors.propertyFeature?.blockNumber && (
                  <p className="text-xs text-red-500 font-medium">{errors.propertyFeature.blockNumber.message}</p>
                )}
              </div>
            </>
          )}

          {/* Hidden switches for now */}
          <div className="hidden">
            {/* Logic for switches can be added here once local Switch is ready */}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <Button
          onClick={props.prev}
          variant="outline"
          className="w-36"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Geri
        </Button>
        <Button
          onClick={handleNext}
          className="w-36"
        >
          İleri
          <ChevronRightIcon className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </Card>
  );
};

export default Features;
