"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OfficeFormSchema, OfficeFormType } from "@/lib/validations/office";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ImageUploader from "@/app/admin/offices/_components/ImageUploader";
import { saveOffice, updateOffice } from "@/lib/actions/office";
import slugify from "slugify";
import dynamic from "next/dynamic";

import { OfficeImage } from "@prisma/client";
import { uploadImages } from "@/lib/upload";
import LocationPicker from "./LocationPicker";
import OfficeImageUploader from "./OfficeImagesUploader";

const QuillEditor = dynamic(() => import("@/app/components/RichTextEditor"), {
  ssr: false,
});

interface OfficeFormProps {
  mode: "add" | "edit";
  office?: any;
}

export default function OfficeForm({ mode, office }: OfficeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(office?.avatarUrl || "");
  const [locationData, setLocationData] = useState<any>({
    countries: [],
    cities: [],
    districts: [],
    neighborhoods: [],
  });
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<any[]>([]);
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState<
    Array<{ neighborhood_id: number; name: string }>
  >([]);
  const [images, setImages] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<number[]>([]);
  const [existingImages, setExistingImages] = useState<OfficeImage[]>(
    office?.images || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(office ? { lat: office.latitude, lng: office.longitude } : null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting: formIsSubmitting },
    watch,
    setValue,
  } = useForm<OfficeFormType>({
    resolver: zodResolver(OfficeFormSchema) as any,
    defaultValues:
      mode === "edit"
        ? {
          ...office,
          description: office.description || "",
          name: office?.name || "",
          email: office?.email || "",
          phone: office?.phone || "",
          fax: office?.fax || "",
          streetAddress: office?.streetAddress || "",
          zip: office?.zip || "",
          countryId: office?.countryId || "",
          cityId: office?.cityId || "",
          districtId: office?.districtId || "",
          neighborhoodId: office?.neighborhoodId || "",
          webUrl: office?.webUrl || "",
          xAccountId: office?.xAccountId || "",
          facebookAccountId: office?.facebookAccountId || "",
          linkedInAccountId: office?.linkedInAccountId || "",
          instagramAccountId: office?.instagramAccountId || "",
          youtubeAccountId: office?.youtubeAccountId || "",
          latitude: office?.latitude || 0,
          longitude: office?.longitude || 0,
        }
        : undefined,
  });

  useEffect(() => {
    if (mode === "edit" && office) {
      Object.entries(office).forEach(([key, value]) => {
        if (key in OfficeFormSchema.shape) {
          setValue(key as keyof OfficeFormType, value as string | number);
        }
      });
    }
  }, [mode, office, setValue]);

  const countryId = watch("countryId");
  const cityId = watch("cityId");
  const districtId = watch("districtId");
  const neighborhoodId = watch("neighborhoodId");

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("/api/data/countries");
        const data = await res.json();
        setLocationData((prev: { countries: any[] }) => ({
          ...prev,
          countries: data,
        }));
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);
  console.log("cloc", locationData.countries);

  // Fetch cities when country changes
  useEffect(() => {
    const fetchCities = async () => {
      if (countryId) {
        try {
          const res = await fetch(`/api/data/cities/${countryId}`);
          const data = await res.json();
          setLocationData((prev: { cities: any[] }) => ({
            ...prev,
            cities: data,
          }));
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      }
    };
    fetchCities();
  }, [countryId]);

  // Fetch districts when city changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (cityId) {
        try {
          const res = await fetch(`/api/data/districts/${cityId}`);
          const data = await res.json();
          setLocationData((prev: { districts: any[] }) => ({
            ...prev,
            districts: data,
          }));
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    };
    fetchDistricts();
  }, [cityId]);

  // Fetch neighborhoods when district changes
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      if (districtId) {
        try {
          const res = await fetch(
            `/api/data/neighborhoods/${cityId}/${districtId}`
          );
          const data = await res.json();
          setLocationData((prev: { neighborhoods: any[] }) => ({
            ...prev,
            neighborhoods: data,
          }));
        } catch (error) {
          console.error("Error fetching neighborhoods:", error);
        }
      }
    };
    fetchNeighborhoods();
  }, [districtId, cityId]);

  useEffect(() => {
    if (countryId) {
      setFilteredCities(
        locationData.cities.filter(
          (city: { country_id: number }) =>
            city.country_id === Number(countryId)
        )
      );
    }
  }, [countryId, locationData.cities]);

  useEffect(() => {
    if (cityId) {
      setFilteredDistricts(
        locationData.districts.filter(
          (district: { city_id: number }) => district.city_id === Number(cityId)
        )
      );
    }
  }, [cityId, locationData.districts]);

  useEffect(() => {
    if (districtId) {
      setFilteredNeighborhoods(
        locationData.neighborhoods.filter(
          (neighborhood: { district_id: number }) =>
            neighborhood.district_id === Number(districtId)
        )
      );
    }
  }, [districtId, locationData.neighborhoods]);

  const onSubmit = async (data: OfficeFormType) => {
    setIsSubmitting(true);
    try {
      const slug = slugify(data.name, { lower: true, strict: true });
      const formData = {
        ...data,
        slug,
        avatarUrl: avatarUrl || "",
        images: existingImages.map((img) => ({ url: img.url })),
        deletedImages: deletedImages,
      };

      if (mode === "edit" && office) {
        await updateOffice(office.id, formData);
      } else {
        await saveOffice(formData);
      }

      toast.success(
        mode === "edit" ? "Ofis güncellendi!" : "Ofis başarıyla oluşturuldu!"
      );
      router.push("/admin/offices");
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setValue("latitude", lat);
    setValue("longitude", lng);
    setMarkerPosition({ lat, lng });
  };

  const handleZoomChange = (zoom: number) => {
    // You can store zoom level in state if needed
    console.log("Zoom level changed:", zoom);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">Ofis Adı</label>
          <Input
            id="name"
            {...register("name")}
            value={watch("name") || ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message as string}</p>
          )}
        </div>

        <ImageUploader
          currentImage={avatarUrl}
          onImageUpload={setAvatarUrl}
          label="Ofis Logosu"
          officeName={watch("name")}
        />

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">E-posta</label>
          <Input
            id="email"
            {...register("email")}
            value={watch("email") || ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">Telefon</label>
          <Input
            id="phone"
            {...register("phone")}
            value={watch("phone") || ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="fax" className="block text-sm font-medium mb-2">Faks</label>
          <Input
            id="fax"
            {...register("fax")}
            value={watch("fax") || ""}
          />
          {errors.fax && (
            <p className="text-sm text-red-500 mt-1">{errors.fax.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="webUrl" className="block text-sm font-medium mb-2">Web Sitesi</label>
          <Input
            id="webUrl"
            {...register("webUrl")}
            value={watch("webUrl") || ""}
          />
          {errors.webUrl && (
            <p className="text-sm text-red-500 mt-1">{errors.webUrl.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-2">Ülke</label>
          <Select
            value={countryId ? String(countryId) : ""}
            onValueChange={(value) => setValue("countryId", value ? Number(value) : undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ülke seçin" />
            </SelectTrigger>
            <SelectContent>
              {(locationData.countries || []).map((country: { country_id: number; country_name: string }) => (
                <SelectItem key={String(country.country_id)} value={String(country.country_id)}>
                  {country.country_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-2">Şehir</label>
          <Select
            value={cityId ? cityId.toString() : ""}
            onValueChange={(value) => setValue("cityId", value ? Number(value) : undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Şehir seçin" />
            </SelectTrigger>
            <SelectContent>
              {(locationData.cities || []).map((city: { city_id: number; city_name: string }) => (
                <SelectItem key={city.city_id.toString()} value={city.city_id.toString()}>
                  {city.city_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-medium mb-2">İlçe</label>
          <Select
            value={districtId ? districtId.toString() : ""}
            onValueChange={(value) => setValue("districtId", value ? Number(value) : undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="İlçe seçin" />
            </SelectTrigger>
            <SelectContent>
              {(locationData.districts || []).map((district: { district_id: number; district_name: string }) => (
                <SelectItem key={district.district_id.toString()} value={district.district_id.toString()}>
                  {district.district_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="neighborhood" className="block text-sm font-medium mb-2">Mahalle</label>
          <Select
            value={neighborhoodId ? neighborhoodId.toString() : ""}
            onValueChange={(value) => setValue("neighborhoodId", value ? Number(value) : undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Mahalle seçin" />
            </SelectTrigger>
            <SelectContent>
              {(locationData.neighborhoods || []).map((neighborhood: {
                neighborhood_id: number;
                neighborhood_name: string;
              }) => (
                <SelectItem key={neighborhood.neighborhood_id.toString()} value={neighborhood.neighborhood_id.toString()}>
                  {neighborhood.neighborhood_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="streetAddress" className="block text-sm font-medium mb-2">Adres</label>
          <Input
            id="streetAddress"
            {...register("streetAddress")}
            value={watch("streetAddress") || ""}
          />
          {errors.streetAddress && (
            <p className="text-sm text-red-500 mt-1">{errors.streetAddress.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="zip" className="block text-sm font-medium mb-2">Posta Kodu</label>
          <Input
            id="zip"
            {...register("zip")}
            value={watch("zip") || ""}
          />
          {errors.zip && (
            <p className="text-sm text-red-500 mt-1">{errors.zip.message as string}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <LocationPicker
            latitude={watch("latitude")}
            longitude={watch("longitude")}
            onLocationChange={handleMapClick}
            onZoomChange={handleZoomChange}
          />
        </div>

        <div>
          <label htmlFor="latitude" className="block text-sm font-medium mb-2">Enlem</label>
          <Input
            id="latitude"
            {...register("latitude", {
              setValueAs: (v) => (v === "" ? 0 : parseFloat(v)),
            })}
            type="number"
            value={watch("latitude") || ""}
            readOnly
          />
          {errors.latitude && (
            <p className="text-sm text-red-500 mt-1">{errors.latitude.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="longitude" className="block text-sm font-medium mb-2">Boylam</label>
          <Input
            id="longitude"
            {...register("longitude", {
              setValueAs: (v) => (v === "" ? 0 : parseFloat(v)),
            })}
            type="number"
            value={watch("longitude") || ""}
            readOnly
          />
          {errors.longitude && (
            <p className="text-sm text-red-500 mt-1">{errors.longitude.message as string}</p>
          )}
        </div>
      </div>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <div className="min-h-[300px]">
            <div className="text-sm font-medium mb-2">Hakkında</div>
            <QuillEditor
              value={field.value || ""}
              onChange={field.onChange}
              className="h-[240px]"
            />
            {errors.description && (
              <p className="text-danger text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="xAccountId" className="block text-sm font-medium mb-2">X (Twitter) Hesabı</label>
          <Input
            id="xAccountId"
            {...register("xAccountId" as keyof OfficeFormType)}
            value={watch("xAccountId" as keyof OfficeFormType) || ""}
          />
        </div>

        <div>
          <label htmlFor="facebookAccountId" className="block text-sm font-medium mb-2">Facebook Hesabı</label>
          <Input
            id="facebookAccountId"
            {...register("facebookAccountId" as keyof OfficeFormType)}
            value={watch("facebookAccountId" as keyof OfficeFormType) || ""}
          />
        </div>

        <div>
          <label htmlFor="linkedInAccountId" className="block text-sm font-medium mb-2">LinkedIn Hesabı</label>
          <Input
            id="linkedInAccountId"
            {...register("linkedInAccountId" as keyof OfficeFormType)}
            value={watch("linkedInAccountId" as keyof OfficeFormType) || ""}
          />
        </div>

        <div>
          <label htmlFor="instagramAccountId" className="block text-sm font-medium mb-2">Instagram Hesabı</label>
          <Input
            id="instagramAccountId"
            {...register("instagramAccountId" as keyof OfficeFormType)}
            value={watch("instagramAccountId" as keyof OfficeFormType) || ""}
          />
        </div>

        <div>
          <label htmlFor="youtubeAccountId" className="block text-sm font-medium mb-2">YouTube Hesabı</label>
          <Input
            id="youtubeAccountId"
            {...register("youtubeAccountId" as keyof OfficeFormType)}
            value={watch("youtubeAccountId" as keyof OfficeFormType) || ""}
          />
        </div>
      </div>

      <div className="mt-6">
        <OfficeImageUploader
          currentImages={existingImages}
          onImagesUpload={(images) => {
            // Find deleted images by comparing existing IDs with new IDs
            const deletedImageIds = existingImages
              .filter((img) => !images.some((newImg) => newImg.id === img.id))
              .map((img) => img.id);

            // Add deleted image IDs to the deletedImages array
            setDeletedImages((prev) => [...prev, ...deletedImageIds]);

            // Update existing images with officeId
            const updatedImages = images.map((img) => ({
              ...img,
              officeId: office?.id || 0,
            }));
            setExistingImages(updatedImages);
          }}
          projectName={watch("name")}
          label="Ofis Görselleri"
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/offices")}
        >
          İptal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {mode === "add" ? "Ekle" : "Güncelle"}
        </Button>
      </div>
    </form>
  );
}
