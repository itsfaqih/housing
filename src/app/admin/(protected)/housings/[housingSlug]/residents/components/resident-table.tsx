import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/utils/date.util";
import {
  ArrowCounterClockwise,
  ArrowDown,
  ArrowUp,
  CaretRight,
  CaretUpDown,
  Trash,
} from "phosphor-react-sc";
import Link from "next/link";
import { User } from "@/schemas/user.schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/text.util";
import { DeleteResidentAccountDialog } from "./delete-resident-account-dialog";
import { RestoreResidentAccountDialog } from "./restore-resident-account-dialog";

type ResidentTableProps = {
  residents: (Pick<User, "avatar" | "full_name" | "email"> & {
    resident_account_id: number;
    resident_account_created_at: Date;
    resident_account_deleted_at: Date | null;
  })[];
  housingSlug: string;
  searchParams?: {
    q?: string;
    archived?: "1";
    page?: `${number}`;
    sort: "updated_at" | "created_at";
    order: "asc" | "desc";
  };
};

export function ResidentTable({
  residents,
  housingSlug,
  searchParams,
}: ResidentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Foto</TableHead>
          <TableHead>Nama Lengkap</TableHead>
          <TableHead>Email</TableHead>
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
        {residents.length === 0 && (
          <TableRow>
            <TableCell colSpan={5}>
              <div className="text-center text-muted-foreground py-2">
                Tidak ada penghuni yang ditemukan.
              </div>
            </TableCell>
          </TableRow>
        )}
        {residents.map((resident) => (
          <TableRow key={resident.resident_account_id}>
            <TableCell>
              <Avatar className="h-8 w-8">
                <AvatarImage src={resident.avatar ?? undefined} alt="" />
                <AvatarFallback>
                  {getInitials(resident.full_name)}
                </AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>{resident.full_name}</TableCell>
            <TableCell>{resident.email}</TableCell>
            <TableCell>
              <span className="pl-4 tabular-nums">
                {formatDateTime(resident.resident_account_created_at)}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Button asChild variant="ghost" size="icon">
                  <Link
                    href={`/admin/housings/${housingSlug}/residents/${resident.resident_account_id}`}
                  >
                    <CaretRight className="h-4 w-4" />
                    <span className="sr-only">Lihat Penghuni</span>
                  </Link>
                </Button>
                {resident.resident_account_deleted_at ? (
                  <RestoreResidentAccountDialog
                    residentAccountId={resident.resident_account_id}
                    residentFullName={resident.full_name}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-600 hover:text-green-700"
                    >
                      <ArrowCounterClockwise className="h-4 w-4" />
                      <span className="sr-only">Pulihkan Penghuni</span>
                    </Button>
                  </RestoreResidentAccountDialog>
                ) : (
                  <DeleteResidentAccountDialog
                    residentAccountId={resident.resident_account_id}
                    residentFullName={resident.full_name}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Hapus Penghuni</span>
                    </Button>
                  </DeleteResidentAccountDialog>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
