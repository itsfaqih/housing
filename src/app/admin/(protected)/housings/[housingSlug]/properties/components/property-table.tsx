import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Property } from "@/schemas/property.schema";
import { formatDateTime } from "@/utils/date.util";
import {
  Archive,
  ArrowCounterClockwise,
  ArrowDown,
  ArrowUp,
  CaretUpDown,
  PencilSimple,
} from "phosphor-react-sc";
import { RestorePropertyDialog } from "./restore-property-dialog";
import { ArchivePropertyDialog } from "./archive-property-dialog";
import Link from "next/link";

type PropertyTableProps = {
  properties: (Property & { occupancies_count: number })[];
  housingSlug: string;
  searchParams?: {
    q?: string;
    archived?: "1";
    page?: `${number}`;
    sort: "resident_count" | "updated_at" | "created_at";
    order: "asc" | "desc";
  };
};

export function PropertyTable({
  properties,
  housingSlug,
  searchParams,
}: PropertyTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>
            <Button asChild variant="ghost">
              <Link
                href={{
                  query: {
                    ...searchParams,
                    sort: "resident_count",
                    order: searchParams?.order === "asc" ? "desc" : "asc",
                  },
                }}
              >
                Jumlah penghuni
                {searchParams?.sort === "resident_count" &&
                  (searchParams?.order === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowDown className="ml-2 h-4 w-4" />
                  ))}
                {searchParams?.sort !== "resident_count" && (
                  <CaretUpDown className="ml-2 h-4 w-4" />
                )}
              </Link>
            </Button>
          </TableHead>
          <TableHead>
            <Button asChild variant="ghost">
              <Link
                href={{
                  query: {
                    ...searchParams,
                    sort: "updated_at",
                    order: searchParams?.order === "asc" ? "desc" : "asc",
                  },
                }}
              >
                Terakhir diperbarui
                {searchParams?.sort === "updated_at" &&
                  (searchParams?.order === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowDown className="ml-2 h-4 w-4" />
                  ))}
                {searchParams?.sort !== "updated_at" && (
                  <CaretUpDown className="ml-2 h-4 w-4" />
                )}
              </Link>
            </Button>
          </TableHead>
          <TableHead>
            <Button asChild variant="ghost">
              <Link
                href={{
                  query: {
                    ...searchParams,
                    sort: "created_at",
                    order: searchParams?.order === "asc" ? "desc" : "asc",
                  },
                }}
              >
                Tanggal penambahan
                {searchParams?.sort === "created_at" &&
                  (searchParams?.order === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowDown className="ml-2 h-4 w-4" />
                  ))}
                {searchParams?.sort !== "created_at" && (
                  <CaretUpDown className="ml-2 h-4 w-4" />
                )}
              </Link>
            </Button>
          </TableHead>
          <TableHead>
            <span className="sr-only">Aksi</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.length === 0 && (
          <TableRow>
            <TableCell colSpan={5}>
              <div className="text-center text-muted-foreground py-2">
                Tidak ada properti yang ditemukan.
              </div>
            </TableCell>
          </TableRow>
        )}
        {properties.map((property) => (
          <TableRow key={property.id}>
            <TableCell>{property.name}</TableCell>
            <TableCell>
              <span className="pl-4 tabular-nums">
                {property.occupancies_count}
              </span>
            </TableCell>
            <TableCell>
              <span className="pl-4 tabular-nums">
                {formatDateTime(property.updated_at)}
              </span>
            </TableCell>
            <TableCell>
              <span className="pl-4 tabular-nums">
                {formatDateTime(property.created_at)}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Button asChild variant="ghost" size="icon">
                  <Link
                    href={`/admin/housings/${housingSlug}/properties/${property.slug}`}
                  >
                    <PencilSimple className="h-4 w-4" />
                    <span className="sr-only">Edit Properti</span>
                  </Link>
                </Button>
                {property.archived_at ? (
                  <RestorePropertyDialog property={property}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-600 hover:text-green-700"
                    >
                      <ArrowCounterClockwise className="h-4 w-4" />
                      <span className="sr-only">Pulihkan Properti</span>
                    </Button>
                  </RestorePropertyDialog>
                ) : (
                  <ArchivePropertyDialog property={property}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                    >
                      <Archive className="h-4 w-4" />
                      <span className="sr-only">Arsipkan Properti</span>
                    </Button>
                  </ArchivePropertyDialog>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
