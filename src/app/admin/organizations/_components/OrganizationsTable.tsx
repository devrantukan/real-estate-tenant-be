"use client";
import { TrashIcon } from "@heroicons/react/16/solid";
import { PencilIcon } from "@heroicons/react/16/solid";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { Organization } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  organizations: Organization[];
  totalPages: number;
  currentPage: number;
};

const OrganizationsTable = ({
  organizations,
  totalPages,
  currentPage,
}: Props) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-4">
      <Table>
        <TableHeader>
          <TableColumn>AD</TableColumn>
          <TableColumn>SLUG</TableColumn>
          <TableColumn>AÇIKLAMA</TableColumn>
          <TableColumn>OLUŞTURULMA</TableColumn>
          <TableColumn>İŞLEMLER</TableColumn>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => (
            <TableRow key={org.id}>
              <TableCell>{org.name}</TableCell>
              <TableCell>{org.slug}</TableCell>
              <TableCell>
                {org.description ? (
                  org.description.length > 50
                    ? `${org.description.substring(0, 50)}...`
                    : org.description
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                {new Date(org.createdAt).toLocaleDateString("tr-TR")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Tooltip content="Düzenle" color="warning">
                    <Link href={`/admin/organizations/${org.id}/edit`}>
                      <PencilIcon className="w-5 text-yellow-500" />
                    </Link>
                  </Tooltip>
                  <Tooltip content="Sil" color="danger">
                    <Link href={`/admin/organizations/${org.id}/delete`}>
                      <TrashIcon className="w-5 text-red-500" />
                    </Link>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 0 && (
        <Pagination
          total={totalPages}
          initialPage={1}
          page={currentPage}
          onChange={(page) =>
            router.push(`/admin/organizations?pagenum=${page}`)
          }
        />
      )}
    </div>
  );
};

export default OrganizationsTable;
