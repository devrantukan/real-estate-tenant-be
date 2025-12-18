"use client";
import React from "react";
import Link from "next/link";
import slugify from "slugify";
import { House } from "@phosphor-icons/react/dist/ssr";

export default function BreadCrumb({
  location,
  contract,
  propertyType,
}: {
  location: {
    country: string;
    city: string;
    district: string;
    neighborhood: string;
    subType: string;
  };
  contract: { slug: string; value: string };
  propertyType: { slug: string };
}) {
  const items = [
    {
      key: "home",
      href: "/",
      content: <House size={16} />,
    },
    {
      key: "contract",
      href: `/${propertyType.slug}/${contract.slug}`,
      content: contract.value,
    },
    {
      key: "country",
      href: `/${propertyType.slug}/${contract.slug}/${slugify(
        location.country,
        { lower: true }
      )}`,
      content: `${location.country} ${contract.value}`,
    },
    {
      key: "city",
      href: `/${propertyType.slug}/${contract.slug}/${slugify(
        location.country,
        { lower: true }
      )}/${slugify(location.city, { lower: true })}`,
      content: `${location.city} ${contract.value}`,
    },
    {
      key: "district",
      href: `/${propertyType.slug}/${contract.slug}/${slugify(
        location.country,
        { lower: true }
      )}/${slugify(location.city, { lower: true })}/${slugify(
        location.district,
        { lower: true }
      )}`,
      content: `${location.district} ${contract.value}`,
    },
    {
      key: "neighborhood",
      href: `/${propertyType.slug}/${contract.slug}/${slugify(
        location.country,
        { lower: true }
      )}/${slugify(location.city, { lower: true })}/${slugify(
        location.district,
        { lower: true }
      )}/${slugify(location.neighborhood, { lower: true })}`,
      content: location.neighborhood,
    },
    {
      key: "subType",
      href: "#",
      content: location.subType,
    },
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={item.key}>
          {index > 0 && <span className="text-gray-400">/</span>}
          <Link
            href={item.href}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            {item.content}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}
