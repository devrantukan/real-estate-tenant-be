"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CountrySchema,
  CitySchema,
  DistrictSchema,
  NeighborhoodSchema,
} from "@/lib/validations/location";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  item: any;
  onSuccess: () => void;
  countries: any[];
  cities: any[];
  districts: any[];
};

export default function LocationModal({
  isOpen,
  onClose,
  type,
  item,
  onSuccess,
  countries,
  cities,
  districts,
}: Props) {
  const schema =
    {
      countries: CountrySchema,
      cities: CitySchema,
      districts: DistrictSchema,
      neighborhoods: NeighborhoodSchema,
    }[type] || CountrySchema;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [formData, setFormData] = useState({
    country_name: "",
    city_name: "",
    district_name: "",
    neighborhood_name: "",
    country_id: "",
    city_id: "",
    district_id: "",
    slug: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        country_name: item.country_name || "",
        city_name: item.city_name || "",
        district_name: item.district_name || "",
        neighborhood_name: item.neighborhood_name || "",
        country_id: item.country_id?.toString() || "",
        city_id: item.city_id?.toString() || "",
        district_id: item.district_id?.toString() || "",
        slug: item.slug || "",
      });
    } else {
      resetForm();
    }
  }, [item]);

  // Add new effect to reset form when type changes
  useEffect(() => {
    resetForm();
  }, [type]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert IDs to numbers
      const payload = {
        ...formData,
        ...(type === "cities" && { country_id: parseInt(formData.country_id) }),
        ...(type === "districts" && { city_id: parseInt(formData.city_id) }),
        ...(type === "neighborhoods" && {
          district_id: parseInt(formData.district_id),
        }),
      };

      const response = await fetch(`/api/locations/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast.success("Kayıt başarıyla eklendi");
      onSuccess();
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      country_name: "",
      city_name: "",
      district_name: "",
      neighborhood_name: "",
      country_id: "",
      city_id: "",
      district_id: "",
      slug: "",
    });
  };

  const getTitle = () => {
    const action = item ? "Düzenle" : "Ekle";
    const entity = {
      countries: "Ülke",
      cities: "Şehir",
      districts: "İlçe",
      neighborhoods: "Mahalle",
    }[type];
    return `${entity} ${action}`;
  };

  const renderFields = () => {
    switch (type) {
      case "cities":
        return (
          <>
            <label htmlFor="city_name" className="block text-sm font-medium mb-2">Şehir Adı</label>
            <Input
              id="city_name"
              value={formData.city_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, city_name: e.target.value })
              }
            />
            <label htmlFor="country" className="block text-sm font-medium mb-2 mt-4">Ülke</label>
            <Select
              value={formData.country_id ? String(formData.country_id) : ""}
              onValueChange={(value) => {
                setFormData({ ...formData, country_id: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ülke seçin" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.country_id} value={String(country.country_id)}>
                    {country.country_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label htmlFor="slug-country" className="block text-sm font-medium mb-2 mt-4">Slug</label>
            <Input
              id="slug-country"
              value={formData.slug || ""}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />
          </>
        );
      case "countries":
        return (
          <>
            <label htmlFor="country_name" className="block text-sm font-medium mb-2">Ülke Adı</label>
            <Input
              id="country_name"
              value={formData.country_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, country_name: e.target.value })
              }
            />
            {(errors as any).country_name?.message && (
              <p className="text-sm text-destructive mt-1">{(errors as any).country_name.message.toString()}</p>
            )}
            <label htmlFor="slug" className="block text-sm font-medium mb-2 mt-4">Slug</label>
            <Input
              id="slug"
              value={formData.slug || ""}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />
            {(errors as any).slug?.message && (
              <p className="text-sm text-destructive mt-1">{(errors as any).slug.message.toString()}</p>
            )}
          </>
        );
      case "districts":
        return (
          <>
            <label htmlFor="district_name" className="block text-sm font-medium mb-2">İlçe Adı</label>
            <Input
              id="district_name"
              value={formData.district_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, district_name: e.target.value })
              }
            />
            <label htmlFor="country-select" className="block text-sm font-medium mb-2 mt-4">Ülke</label>
            <Select
              value={formData.country_id ? formData.country_id.toString() : ""}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  country_id: value,
                  city_id: "", // Reset city when country changes
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ülke seçin" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.country_id.toString()} value={country.country_id.toString()}>
                    {country.country_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label htmlFor="city-select" className="block text-sm font-medium mb-2 mt-4">Şehir</label>
            <Select
              value={formData.city_id ? formData.city_id.toString() : ""}
              onValueChange={(value) => {
                setFormData({ ...formData, city_id: value });
              }}
              disabled={!formData.country_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Şehir seçin" />
              </SelectTrigger>
              <SelectContent>
                {cities
                  .filter(
                    (city) => city.country_id === parseInt(formData.country_id)
                  )
                  .map((city) => (
                    <SelectItem key={city.city_id.toString()} value={city.city_id.toString()}>
                      {city.city_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <label htmlFor="slug-district" className="block text-sm font-medium mb-2 mt-4">Slug</label>
            <Input
              id="slug-district"
              value={formData.slug || ""}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />
          </>
        );
      case "neighborhoods":
        return (
          <>
            <label htmlFor="neighborhood_name" className="block text-sm font-medium mb-2">Mahalle Adı</label>
            <Input
              id="neighborhood_name"
              value={formData.neighborhood_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, neighborhood_name: e.target.value })
              }
            />
            <label htmlFor="country-select-2" className="block text-sm font-medium mb-2 mt-4">Ülke</label>
            <Select
              value={formData.country_id ? formData.country_id.toString() : ""}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  country_id: value,
                  city_id: "", // Reset city when country changes
                  district_id: "", // Reset district when country changes
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ülke seçin" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.country_id} value={String(country.country_id)}>
                    {country.country_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label htmlFor="city-select-2" className="block text-sm font-medium mb-2 mt-4">Şehir</label>
            <Select
              value={formData.city_id ? formData.city_id.toString() : ""}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  city_id: value,
                  district_id: "", // Reset district when city changes
                });
              }}
              disabled={!formData.country_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Şehir seçin" />
              </SelectTrigger>
              <SelectContent>
                {cities
                  .filter((city) => {
                    const selectedCountryId = parseInt(formData.country_id);
                    return city.country_id === selectedCountryId;
                  })
                  .sort((a, b) => a.city_name.localeCompare(b.city_name))
                  .map((city) => (
                    <SelectItem key={city.city_id} value={String(city.city_id)}>
                      {city.city_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <label htmlFor="district-select" className="block text-sm font-medium mb-2 mt-4">İlçe</label>
            <Select
              value={formData.district_id ? formData.district_id.toString() : ""}
              onValueChange={(value) =>
                setFormData({ ...formData, district_id: value })
              }
              disabled={!formData.city_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="İlçe seçin" />
              </SelectTrigger>
              <SelectContent>
                {districts
                  .filter((district) => {
                    const selectedCityId = parseInt(formData.city_id);
                    return district.city_id === selectedCityId;
                  })
                  .sort((a, b) => a.district_name.localeCompare(b.district_name))
                  .map((district) => (
                    <SelectItem
                      key={district.district_id}
                      value={String(district.district_id)}
                    >
                      {district.district_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <label htmlFor="slug-neighborhood" className="block text-sm font-medium mb-2 mt-4">Slug</label>
            <Input
              id="slug-neighborhood"
              value={formData.slug || ""}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />
          </>
        );
      default:
        return null;
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="py-4">
            {renderFields()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button">
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              Kaydet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
