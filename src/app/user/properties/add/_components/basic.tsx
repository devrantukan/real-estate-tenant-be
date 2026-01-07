"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import {
  cn,
} from "@heroui/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";

import {
  PropertyStatus,
  PropertyType,
  PropertySubType,
  PropertyContract,
  PropertyDeedStatus,
} from "@prisma/client";
import React, { useEffect } from "react";
import { useForm, useFormContext, useFormState } from "react-hook-form";
import { AddPropertyInputType } from "./AddPropertyForm";
import { format } from "path";

const QuillEditor = dynamic(() => import("@/app/components/RichTextEditor"), {
  ssr: false,
});

interface Props {
  className?: string;
  types: PropertyType[];

  subTypes: PropertySubType[];
  contracts: PropertyContract[];
  statuses: PropertyStatus[];
  deedStatuses: PropertyDeedStatus[];
  next: () => void;
}
const Basic = (props: Props) => {
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    watch,
  } = useFormContext<AddPropertyInputType>();

  const [typeId, setTypeId] = React.useState<number | undefined>(undefined);
  const [subTypeId, setSubTypeId] = React.useState<number | undefined>(
    getValues().subTypeId
  );
  const [description, setDescription] = React.useState("");

  // Watch for changes in contractId and subTypeId
  const contractId = watch("contractId");
  const currentSubTypeId = watch("subTypeId");
  const isSatilik =
    props.contracts.find((c) => c.slug === "satilik")?.id ===
    Number(contractId);
  const isMustakilEv =
    props.subTypes.find((st) => st.id === Number(currentSubTypeId))?.value ===
    "Müstakil ev";

  useEffect(() => {
    const values = getValues();
    if (values.typeId) {
      setTypeId(values.typeId);
    }

    if (values.subTypeId) {
      setValue("subTypeId", values.subTypeId);
      setSubTypeId(values.subTypeId);
    }
    if (values.description) {
      setDescription(values.description);
    }

    // Set default values for floor and totalFloor if it's a Müstakil ev
    if (isMustakilEv) {
      setValue("propertyFeature.floor", 0);
      setValue("propertyFeature.totalFloor", 0);
    }

    // Set default deedStatusId for rental properties
    if (!isSatilik && props.deedStatuses.length > 0) {
      setValue("deedStatusId", 8);
    }
  }, [getValues, setValue, isMustakilEv, isSatilik, props.deedStatuses]);

  //console.log("tid", typeId);
  //console.log("stid", subTypeId);
  //console.log("gvid", getValues().subTypeId);
  const handleNext = async () => {
    const values = getValues();
    console.log("Form values:", values);
    console.log("Form errors:", errors);

    if (
      await trigger([
        "name",
        "description",
        "typeId",
        "subTypeId",
        "contractId",
        "statusId",
        "deedStatusId",
        "price",
        "discountedPrice",
      ])
    )
      props.next();
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTypeId = Number(event.target.value);
    setTypeId(newTypeId);
    setValue("typeId", newTypeId);
  };

  const handleSubTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubTypeId = Number(event.target.value);
    setSubTypeId(newSubTypeId);
    setValue("subTypeId", newSubTypeId);
  };

  const onEditorStateChange = (description: string) => {
    setDescription(description);
    setValue("description", description);
  };

  const formatNumber = (value: string) => {
    // Remove any non-digit characters
    const number = value.replace(/\D/g, "");
    // Format with thousands separator
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (value: string) => {
    // Only allow digits
    const numericValue = value.replace(/[^0-9]/g, "");
    setValue("price", numericValue ? Number(numericValue) : 0, {
      shouldValidate: true,
    });
  };

  const handleDiscountedPriceChange = (value: string) => {
    // Only allow digits
    const numericValue = value.replace(/[^0-9]/g, "");
    setValue("discountedPrice", numericValue, { shouldValidate: true });
  };

  return (
    <Card className={cn("p-4 flex flex-col gap-6", props.className)}>
      <div className="space-y-2">
        <Label>Başlık</Label>
        <Input
          {...register("name")}
          defaultValue={getValues().name}
          placeholder="İlan başlığı girin"
        />
        {errors.name && (
          <p className="text-red-500 text-xs font-medium">{errors.name.message}</p>
        )}
      </div>

      <div className="w-full  h-[460px] p-2 bg-gray-100 rounded-xl">
        <p className="text-xs mb-1">Detaylı Bilgi</p>
        <QuillEditor
          className="h-[380px] rounded-lg border-gray-200"
          value={description}
          onChange={onEditorStateChange}
        />
      </div>

      <div className="hidden">
        <textarea
          {...register("description")}
          name="description"
          defaultValue={getValues().description}
          onChange={(e) => onEditorStateChange(e.target.value)}
        />
      </div>
      <div className="flex lg:flex-row flex-col gap-4 ">
        <div className="flex-1 space-y-2">
          <Label>Hizmet Tipi</Label>
          <Select
            value={contractId?.toString() || ""}
            onValueChange={(v) => setValue("contractId", Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {props.contracts.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.contractId && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.contractId.message}</p>
          )}
        </div>

        {isSatilik && (
          <div className="flex-1 space-y-2">
            <Label>Tapu Durumu</Label>
            <Select
              value={watch("deedStatusId")?.toString() || ""}
              onValueChange={(v) => setValue("deedStatusId", Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {props.deedStatuses.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.deedStatusId && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.deedStatusId.message}</p>
            )}
          </div>
        )}

        <div className="flex-1 space-y-2">
          <Label>Gayrimenkul Tipi</Label>
          <Select
            value={typeId?.toString() || ""}
            onValueChange={(v) => {
              const newTypeId = Number(v);
              setTypeId(newTypeId);
              setValue("typeId", newTypeId);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {props.types.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.typeId && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.typeId.message}</p>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Label>Gayrimenkul Alt Tipi</Label>
          <Select
            value={subTypeId?.toString() || ""}
            onValueChange={(v) => {
              const newSubTypeId = Number(v);
              setSubTypeId(newSubTypeId);
              setValue("subTypeId", newSubTypeId);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {props.subTypes
                .filter((item) => item.typeId == typeId)
                .map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.value}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.subTypeId && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.subTypeId.message}</p>
          )}
        </div>
      </div>
      <div className="flex lg:flex-row flex-col gap-4 ">
        <div className="flex-1 space-y-2">
          <Label>Kontrat Tipi</Label>
          <Select
            value={watch("statusId")?.toString() || ""}
            onValueChange={(v) => setValue("statusId", Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {props.statuses.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.statusId && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.statusId.message}</p>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Label>İndirimli Fiyat</Label>
          <Input
            {...register("discountedPrice", {
              setValueAs: (v: any) => v.toString(),
            })}
            defaultValue={getValues().discountedPrice ?? ""}
            onInput={(e) => handleDiscountedPriceChange(e.currentTarget.value)}
            type="text"
            inputMode="numeric"
            placeholder="0"
          />
          {errors.discountedPrice && (
            <p className="text-red-500 text-xs font-medium">{errors.discountedPrice.message}</p>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Label>Fiyat</Label>
          <Input
            {...register("price", {
              setValueAs: (v: any) => v.toString(),
            })}
            defaultValue={getValues().price?.toString() || ""}
            onInput={(e) => handlePriceChange(e.currentTarget.value)}
            type="text"
            inputMode="numeric"
            placeholder="0"
          />
          {errors.price && (
            <p className="text-red-500 text-xs font-medium">{errors.price.message}</p>
          )}
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <Button
          disabled
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
export default Basic;
