"use client";

import {
  Button,
  Input,
  Select,
  ListBox,
  Switch,
  Spinner,
} from "@heroui/react";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createProject, updateProject } from "@/app/actions/project";
import { projectSchema } from "@/lib/validations/project";
import ProjectImagesUploader from "./ProjectImagesUploader";
import slugify from "slugify";
import LocationPicker from "@/app/components/LocationPicker";
import axios from "axios";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

type Props = {
  project?: Prisma.ProjectGetPayload<{
    include: {
      location: true;
      unitSizes: true;
      socialFeatures: true;
      images: true;
    };
  }> & {
    catalogUrl?: string | null;
  };
  offices: { id: number; name: string }[];
  agents?: {
    id: number;
    name: string;
    surname: string;
    officeId: number;
    role: {
      id: number;
      title: string;
      slug: string;
    };
  }[];
  countries: { country_name: string }[];
  cities: { city_name: string }[];
  citiesObj: Record<string, string[]>;
};

interface FormData {
  name: string;
  description: string;
  officeId: string;
  assignedAgents: string;
  publishingStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  startDate: Date;
  endDate: Date;
  deedInfo: string;
  landArea: string;
  nOfUnits: string;
  slug: string;
  catalogUrl?: string;
  location: {
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    landmark?: string;
    district: string;
    neighborhood: string;
    latitude?: number;
    longitude?: number;
  };
  unitSizes: { value: string }[];
  socialFeatures: { value: string }[];
  images: { url: string; order: number }[];
}

const QuillEditor = dynamic(() => import("@/app/components/RichTextEditor"), {
  ssr: false,
});

const ProjectForm = ({
  project,
  offices,
  agents = [],
  countries,
  cities,
  citiesObj,
}: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingNeighborhoods, setIsLoadingNeighborhoods] = useState(false);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [districtOptions, setDistrictOptions] = useState<any[]>([]);
  const [neighborhoodOptions, setNeighborhoodOptions] = useState<any[]>([]);
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedAgentNames, setSelectedAgentNames] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: project?.name || "",
    description: project?.description || "",
    officeId: project?.officeId.toString() || "",
    assignedAgents: project?.assignedAgents || "",
    publishingStatus:
      (project?.publishingStatus as "DRAFT" | "PUBLISHED" | "ARCHIVED") ||
      "DRAFT",
    startDate: project?.startDate || new Date(),
    endDate: project?.endDate || new Date(),
    deedInfo: project?.deedInfo || "",
    landArea: project?.landArea || "",
    nOfUnits: project?.nOfUnits || "",
    slug: project?.slug || "",
    catalogUrl: project?.catalogUrl || "",
    location: {
      streetAddress: project?.location?.streetAddress || "",
      city: project?.location?.city || "",
      state: project?.location?.state || "",
      zip: project?.location?.zip || "",
      country: project?.location?.country || "",
      landmark: project?.location?.landmark || "",
      district: project?.location?.district || "",
      neighborhood: project?.location?.neighborhood || "",
      latitude: project?.location?.latitude || undefined,
      longitude: project?.location?.longitude || undefined,
    },
    unitSizes: project?.unitSizes.map((size) => ({ value: size.value })) || [],
    socialFeatures:
      project?.socialFeatures.map((feature) => ({ value: feature.value })) ||
      [],
    images:
      project?.images.map((img, index) => ({
        url: img.url,
        order: index,
      })) || [],
  });

  // Initialize form data and location when project changes
  useEffect(() => {
    if (project) {
      console.log("Project assigned agents:", project.assignedAgents);

      const newFormData: FormData = {
        name: project.name || "",
        description: project.description || "",
        officeId: project.officeId ? project.officeId.toString() : "",
        assignedAgents: project.assignedAgents || "",
        publishingStatus: project.publishingStatus as
          | "DRAFT"
          | "PUBLISHED"
          | "ARCHIVED",
        startDate: project.startDate ? new Date(project.startDate) : new Date(),
        endDate: project.endDate ? new Date(project.endDate) : new Date(),
        deedInfo: project.deedInfo || "",
        landArea: project.landArea || "",
        nOfUnits: project.nOfUnits || "",
        catalogUrl: project.catalogUrl || "",
        slug: project.slug || "",
        location: {
          streetAddress: project.location?.streetAddress || "",
          city: project.location?.city || "",
          state: project.location?.state || "",
          zip: project.location?.zip || "",
          country: project.location?.country || "",
          landmark: project.location?.landmark || "",
          district: project.location?.district || "",
          neighborhood: project.location?.neighborhood || "",
          latitude: project.location?.latitude || undefined,
          longitude: project.location?.longitude || undefined,
        },
        unitSizes:
          project.unitSizes.map((size) => ({ value: size.value })) || [],
        socialFeatures:
          project.socialFeatures.map((feature) => ({ value: feature.value })) ||
          [],
        images:
          project.images.map((img, index) => ({
            url: img.url,
            order: index,
          })) || [],
      };

      setFormData(newFormData);

      // Set location states and fetch related data
      if (project.location) {
        const { country, city, district, neighborhood } = project.location;

        // Set location states first
        if (country) {
          setCountry(country);
          // Update city options based on country
          setCityOptions(citiesObj[country] || []);
        }

        if (city) {
          setCity(city);
          // Fetch districts for the city
          fetchDistricts(city);
        }

        if (district) {
          setDistrict(district);
          // Fetch neighborhoods for the district
          if (city) {
            fetchNeighborhoods(city, district);
          }
        }

        if (neighborhood) {
          setNeighborhood(neighborhood);
        }

        // Set marker position if coordinates exist
        if (project.location.latitude && project.location.longitude) {
          const lat = project.location.latitude;
          const lng = project.location.longitude;
          setMarkerPosition({ lat, lng });
          // Also update form data with coordinates
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: lat,
              longitude: lng,
            },
          }));
        }
      }
    }
  }, [project, citiesObj]);

  // Update city options when country changes
  useEffect(() => {
    if (country) {
      setCityOptions(citiesObj[country] || []);
      if (!project) {
        setCity("");
        setDistrict("");
        setNeighborhood("");
      }
    }
  }, [country, citiesObj, project]);

  // Fetch districts when city changes
  useEffect(() => {
    if (city) {
      fetchDistricts(city);
      if (!project) {
        setDistrict("");
        setNeighborhood("");
      }
    }
  }, [city, project]);

  // Fetch neighborhoods when district changes
  useEffect(() => {
    if (district && city) {
      fetchNeighborhoods(city, district);
      if (!project) {
        setNeighborhood("");
      }
    }
  }, [district, city, project]);

  // Update selected agent names when assigned agents change
  useEffect(() => {
    if (formData.assignedAgents && agents) {
      const agentIds = formData.assignedAgents.split(",").filter(Boolean);
      const names = agentIds
        .map((id) => {
          const agent = agents.find((a) => a.id.toString() === id);
          return agent ? `${agent.name} ${agent.surname}` : "";
        })
        .filter(Boolean);
      setSelectedAgentNames(names);
    } else {
      setSelectedAgentNames([]);
    }
  }, [formData.assignedAgents, agents]);

  useEffect(() => {
    // Check if the office exists in the offices list
    if (project?.officeId) {
      const officeExists = offices.some(
        (office) => office.id === project.officeId
      );
      console.log("Office exists in list:", officeExists);
    }
  }, [project, formData.officeId, offices]);

  async function fetchDistricts(city_slug: string) {
    setIsLoadingDistricts(true);
    try {
      const response = await axios.get(
        `/api/location/get-districts/${city_slug}`
      );
      setDistrictOptions(response.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setIsLoadingDistricts(false);
    }
  }

  async function fetchNeighborhoods(city_slug: string, district_slug: string) {
    setIsLoadingNeighborhoods(true);
    try {
      const response = await axios.get(
        `/api/location/get-neighborhood/${encodeURIComponent(
          city_slug
        )}/${encodeURIComponent(district_slug)}`
      );
      setNeighborhoodOptions(response.data);
    } catch (error) {
      console.error("Error fetching neighborhoods:", error);
      setNeighborhoodOptions([]);
    } finally {
      setIsLoadingNeighborhoods(false);
    }
  }

  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry);
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, country: selectedCountry },
    }));
    // Reset other location fields
    setCity("");
    setDistrict("");
    setNeighborhood("");
    setCityOptions([]);
    setDistrictOptions([]);
    setNeighborhoodOptions([]);
    // Update city options based on the selected country
    if (selectedCountry) {
      setCityOptions(citiesObj[selectedCountry] || []);
    }
    // Reset marker position when country changes
    setMarkerPosition(null);
  };

  const handleCityChange = (selectedCity: string) => {
    setCity(selectedCity);
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, city: selectedCity },
    }));
    // Reset dependent fields
    setDistrict("");
    setNeighborhood("");
    setDistrictOptions([]);
    setNeighborhoodOptions([]);
    // Fetch districts for the selected city
    if (selectedCity) {
      fetchDistricts(selectedCity);
      // Fetch coordinates for the city
      fetchCoordinates(selectedCity, "", "", "");
    }
    // Reset marker position when city changes
    setMarkerPosition(null);
  };

  const handleDistrictChange = (selectedDistrict: string) => {
    setDistrict(selectedDistrict);
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        district: selectedDistrict,
        state: selectedDistrict,
      },
    }));
    // Reset dependent field
    setNeighborhood("");
    setNeighborhoodOptions([]);
    // Fetch neighborhoods for the selected district
    if (selectedDistrict && city) {
      fetchNeighborhoods(city, selectedDistrict);
      // Fetch coordinates for the district
      fetchCoordinates(city, selectedDistrict, "", "");
    }
    // Reset marker position when district changes
    setMarkerPosition(null);
  };

  const handleNeighborhoodChange = (selectedNeighborhood: string) => {
    setNeighborhood(selectedNeighborhood);
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, neighborhood: selectedNeighborhood },
    }));
    // Fetch coordinates for the neighborhood
    if (selectedNeighborhood && city && district) {
      fetchCoordinates(city, district, selectedNeighborhood, "");
    }
    // Reset marker position when neighborhood changes
    setMarkerPosition(null);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPosition({ lat, lng });
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        latitude: lat,
        longitude: lng,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Transform the data to match the schema
      const transformedData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        officeId: formData.officeId ? Number(formData.officeId) : 0,
        publishingStatus: formData.publishingStatus as
          | "DRAFT"
          | "PUBLISHED"
          | "ARCHIVED",
        slug: project
          ? formData.slug
          : slugify(formData.name, { lower: true, strict: true }),
      };

      console.log("Transformed data:", transformedData); // Add this for debugging

      const validatedData = projectSchema.parse(transformedData);
      const result = project
        ? await updateProject(project.id, validatedData)
        : await createProject(validatedData);

      if (result.success) {
        toast.success(
          project
            ? "Proje başarıyla güncellendi"
            : "Proje başarıyla oluşturuldu"
        );
        //router.push("/admin/projects");
        window.location.assign("/admin/projects");
      } else {
        toast.error(result.error || "Bir hata oluştu");
      }
    } catch (error) {
      console.error("Validation error:", error);
      if (error instanceof Error) {
        toast.error(`Doğrulama hatası: ${error.message}`);
      } else {
        toast.error("Lütfen tüm alanları doğru şekilde doldurun");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = (field: "unitSizes" | "socialFeatures" | "images") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], { value: "" }],
    }));
  };

  const handleRemoveItem = (
    field: "unitSizes" | "socialFeatures" | "images",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (
    field: "unitSizes" | "socialFeatures" | "images",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, value } : item
      ),
    }));
  };

  const fetchCoordinates = async (
    city: string,
    district: string,
    neighborhood: string,
    address: string
  ) => {
    setIsLoadingCoordinates(true);
    try {
      // Try different address formats
      const addressFormats: string[] = [];

      // Add full address with neighborhood if available
      if (neighborhood) {
        addressFormats.push(
          `${neighborhood}, ${district} İlçesi, ${city} İli, Türkiye`
        );
      }

      // Add other address formats
      addressFormats.push(
        `${district} İlçesi, ${city} İli, Türkiye`,
        `${city} İli, ${district} İlçesi, Türkiye`,
        `${district} İlçesi, Türkiye`,
        `${city} İli, Türkiye`
      );

      let coordinatesFound = false;

      for (const addressString of addressFormats) {
        const response = await axios.get(
          `/api/location/get-coordinates?location=${encodeURIComponent(
            addressString
          )}&region=tr`
        );

        if (response.data.candidates && response.data.candidates.length > 0) {
          const { lat, lng } = response.data.candidates[0].geometry.location;
          setMarkerPosition({ lat, lng });
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: lat,
              longitude: lng,
            },
          }));
          coordinatesFound = true;
          break;
        }
      }

      if (!coordinatesFound) {
        console.warn("No coordinates found for any address format:", {
          city,
          district,
          neighborhood,
          triedFormats: addressFormats,
        });
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    } finally {
      setIsLoadingCoordinates(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">Proje Adı</label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <div>
          <label htmlFor="catalogUrl" className="block text-sm font-medium mb-2">Katalog URL</label>
          <Input
            id="catalogUrl"
            value={formData.catalogUrl || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, catalogUrl: e.target.value }))
            }
            placeholder="https://example.com/catalog.pdf"
          />
        </div>

        <div>
          <label htmlFor="office" className="block text-sm font-medium mb-2">Ofis</label>
          <Select
            selectedKey={formData.officeId || undefined}
            onSelectionChange={(key) => {
              const selectedKey = key?.toString() || "";
              setFormData((prev) => ({
                ...prev,
                officeId: selectedKey,
                assignedAgents: "",
              }));
            }}
          >
            {offices.map((office) => (
              <ListBox.Item key={office.id.toString()}>
                {office.name}
              </ListBox.Item>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="assignedAgents" className="block text-sm font-medium mb-2">Atanmış Danışmanlar</label>
          <Select
            selectedKey={formData.assignedAgents ? formData.assignedAgents.split(",")[0] : undefined}
            onSelectionChange={(key) => {
              const selectedId = key?.toString() || "";
              setFormData((prev) => ({
                ...prev,
                assignedAgents: selectedId,
              }));
            }}
            isDisabled={!formData.officeId}
          >
            {agents
              ?.filter((agent) => {
                // If no office is selected, show all agents
                if (!formData.officeId) return true;
                // Otherwise, show only agents from the selected office
                // and exclude specific roles
                const excludedRoleIds = [10, 11, 12, 4]; // Karşılama ve Servis Sorumlusu, İş Geliştirme, Proje Geliştirme
                return (
                  agent.officeId === Number(formData.officeId) &&
                  !excludedRoleIds.includes(agent.role.id)
                );
              })
              .map((agent) => (
                <ListBox.Item
                  key={agent.id.toString()}
                >
                  {agent.name} {agent.surname}
                </ListBox.Item>
              ))}
          </Select>

          {selectedAgentNames.length > 0 && (
            <div className="mt-2 p-2 bg-gray-100 rounded-md">
              <p className="text-sm font-medium">Seçilen Danışmanlar:</p>
              <ul className="mt-1 list-disc list-inside">
                {selectedAgentNames.map((name, index) => (
                  <li key={index} className="text-sm">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-2">Başlangıç Tarihi</label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                startDate: new Date(e.target.value),
              }))
            }
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-2">Teslim Tarihi</label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                endDate: new Date(e.target.value),
              }))
            }
          />
        </div>

        <div>
          <label htmlFor="deedInfo" className="block text-sm font-medium mb-2">Tapu Bilgisi</label>
          <Input
            id="deedInfo"
            value={formData.deedInfo || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, deedInfo: e.target.value }))
            }
          />
        </div>

        <div>
          <label htmlFor="landArea" className="block text-sm font-medium mb-2">Arsa Alanı</label>
          <Input
            id="landArea"
            value={formData.landArea || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, landArea: e.target.value }))
            }
          />
        </div>

        <div>
          <label htmlFor="nOfUnits" className="block text-sm font-medium mb-2">Konut Adeti</label>
          <Input
            id="nOfUnits"
            value={formData.nOfUnits || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nOfUnits: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Konum Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full flex flex-col gap-y-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">Ülke</label>
              <Select
                selectedKey={country || undefined}
                onSelectionChange={(key) => handleCountryChange(key?.toString() || "")}
              >
                {countries.map((item) => (
                  <ListBox.Item key={item.country_name}>
                    {item.country_name}
                  </ListBox.Item>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">Şehir</label>
              <Select
                selectedKey={city || undefined}
                onSelectionChange={(key) => handleCityChange(key?.toString() || "")}
                isDisabled={isLoadingDistricts || !country}
              >
                {cityOptions.map((c) => (
                  <ListBox.Item key={c}>
                    {c}
                  </ListBox.Item>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="district" className="block text-sm font-medium mb-2">İlçe</label>
              <Select
                selectedKey={district || undefined}
                onSelectionChange={(key) => handleDistrictChange(key?.toString() || "")}
                isDisabled={isLoadingNeighborhoods || !city}
              >
                {districtOptions.map((c) => (
                  <ListBox.Item key={c.label}>
                    {c.label}
                  </ListBox.Item>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium mb-2">Mahalle</label>
              <Select
                selectedKey={neighborhood || undefined}
                onSelectionChange={(key) => handleNeighborhoodChange(key?.toString() || "")}
                isDisabled={!district}
              >
                {neighborhoodOptions.map((c) => (
                  <ListBox.Item key={c.label}>
                    {c.label}
                  </ListBox.Item>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="streetAddress" className="block text-sm font-medium mb-2">Adres</label>
              <Input
                id="streetAddress"
                value={formData.location.streetAddress || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: { ...prev.location, streetAddress: e.target.value },
                  }))
                }
              />
            </div>

            <div>
              <label htmlFor="zip" className="block text-sm font-medium mb-2">Posta Kodu</label>
              <Input
                id="zip"
                value={formData.location.zip || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: { ...prev.location, zip: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-y-4 relative">
            {isLoadingCoordinates && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <Spinner size="lg" />
              </div>
            )}
            <LocationPicker
              lat={formData.location.latitude}
              lng={formData.location.longitude}
              country={formData.location.country}
              city={formData.location.city}
              district={formData.location.district}
              neighborhood={formData.location.neighborhood}
              mode={project ? "edit" : "add"}
              onMapClick={handleMapClick}
              markerPosition={markerPosition}
              setMarkerPosition={setMarkerPosition}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Konut Büyüklükleri</h3>
          <Button
            type="button"
            variant="primary"
            onClick={() => handleAddItem("unitSizes")}
          >
            Ekle
          </Button>
        </div>
        {formData.unitSizes.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item.value || ""}
              onChange={(e) =>
                handleItemChange("unitSizes", index, e.target.value)
              }
              placeholder="Birim büyüklüğü"
              required
            />
            <Button
              type="button"
              variant="danger-soft"
              onClick={() => handleRemoveItem("unitSizes", index)}
            >
              Sil
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Sosyal Özellikler</h3>
          <Button
            type="button"
            variant="primary"
            onClick={() => handleAddItem("socialFeatures")}
          >
            Ekle
          </Button>
        </div>
        {formData.socialFeatures.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item.value || ""}
              onChange={(e) =>
                handleItemChange("socialFeatures", index, e.target.value)
              }
              placeholder="Sosyal özellik"
              required
            />
            <Button
              type="button"
              variant="danger-soft"
              onClick={() => handleRemoveItem("socialFeatures", index)}
            >
              Sil
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Görseller</h3>
        <ProjectImagesUploader
          currentImages={formData.images.map((img) => ({
            url: img.url,
            order: img.order,
          }))}
          onImagesUpload={(urls: { url: string; order: number }[]) =>
            setFormData((prev) => ({
              ...prev,
              images: urls,
            }))
          }
          projectName={formData.name}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Açıklama</h3>
        <div className="min-h-[300px]">
          <QuillEditor
            value={formData.description || ""}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, description: value }))
            }
            className="h-[260px]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/projects")}
        >
          İptal
        </Button>
        <Button type="submit" variant="primary" isDisabled={isLoading}>
          {project ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
