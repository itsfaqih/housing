import { PageTitle } from "@/app/admin/(protected)/components/page-title";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db.lib";
import { propertiesTable } from "@/schemas/property.schema";
import { formatDateTime } from "@/utils/date.util";
import { getInitials } from "@/utils/text.util";
import { eq, isNull } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, DotsThreeVertical } from "phosphor-react-sc";
import { UpdatePropertyForm } from "./components/update-property-form";
import Link from "next/link";
import { ArchivePropertyDialog } from "../components/archive-property-dialog";
import { RestorePropertyDialog } from "../components/restore-property-dialog";
import { Combobox } from "@/components/derived/combobox";
import { CreatePropertyOccupancyCombobox } from "./components/create-property-occupancy-combobox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteOccupancyButton } from "../../components/delete-occupancy-button";
import { propertyOccupanciesTable } from "@/schemas";
import { RestoreOccupancyButton } from "../../components/restore-occupancy-button";

export const metadata: Metadata = {
  title: "Detail Properti",
  description: "",
};

type PropertyDetailPageProps = {
  params: {
    housingSlug: string;
    propertySlug: string;
  };
};

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const property = await db.query.propertiesTable.findFirst({
    where: eq(propertiesTable.slug, params.propertySlug),
    with: {
      occupancies: {
        columns: {
          id: true,
          created_at: true,
          deleted_at: true,
        },
        with: {
          residentAccount: {
            with: {
              user: {
                columns: {
                  id: true,
                  full_name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!property) {
    return notFound();
  }

  const activeOccupancies = property.occupancies.filter(
    (occupancy) => occupancy.deleted_at === null
  );

  const pastOccupancies = property.occupancies.filter(
    (occupancy) => occupancy.deleted_at !== null
  );

  return (
    <div>
      <Button variant="ghost" asChild>
        <Link href={`/admin/housings/${params.housingSlug}/properties`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Link>
      </Button>
      <div className="flex items-center justify-between mt-4">
        <PageTitle>Detail Properti - {property.name}</PageTitle>
        <div className="flex items-center space-x-2">
          {property.archived_at ? (
            <RestorePropertyDialog property={property}>
              <Button variant="secondary">Pulihkan Properti</Button>
            </RestorePropertyDialog>
          ) : (
            <ArchivePropertyDialog property={property}>
              <Button variant="destructive">Arsipkan Properti</Button>
            </ArchivePropertyDialog>
          )}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <UpdatePropertyForm property={property} />
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Daftar Penghuni</CardTitle>
                <CreatePropertyOccupancyCombobox />
              </div>
            </CardHeader>
            <CardContent>
              {activeOccupancies.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm leading-5 text-gray-500">
                    Belum ada penghuni yang ditambahkan.
                  </p>
                </div>
              )}
              {activeOccupancies.length > 0 && (
                <ul role="list" className="divide-y divide-gray-100">
                  {activeOccupancies.map((occupancy) => (
                    <li
                      key={occupancy.id}
                      className="relative flex items-center gap-x-4 px-4 py-3 hover:bg-gray-50 -mx-4"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={
                            occupancy.residentAccount.user.avatar ?? undefined
                          }
                          alt=""
                        />
                        <AvatarFallback>
                          {getInitials(
                            occupancy.residentAccount.user.full_name
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm flex font-semibold text-gray-900">
                          <span className="truncate">
                            {occupancy.residentAccount.user.full_name}
                          </span>
                        </p>
                        <p className="mt-1 flex text-sm text-gray-500">
                          <span className="truncate">
                            {occupancy.residentAccount.user.email}
                          </span>
                        </p>
                        <p className="mt-1 text-sm leading-5 text-gray-500">
                          Ditambahkan pada{" "}
                          <time dateTime={occupancy.created_at.toISOString()}>
                            {formatDateTime(occupancy.created_at)}
                          </time>
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <DotsThreeVertical
                              weight="bold"
                              className="h-4 w-4"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/housings/${params.housingSlug}/residents/${occupancy.residentAccount.id}`}
                              >
                                Lihat Penghuni
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                              <DeleteOccupancyButton
                                housingSlug={params.housingSlug}
                                propertySlug={params.propertySlug}
                                occupancyId={occupancy.id}
                              >
                                Hapus Kepenghunian
                              </DeleteOccupancyButton>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Riwayat Penghuni</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {pastOccupancies.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm leading-5 text-gray-500">
                    Belum ada penghuni.
                  </p>
                </div>
              )}
              {pastOccupancies.length > 0 && (
                <ul role="list" className="divide-y divide-gray-100">
                  {pastOccupancies.map((occupancy) => (
                    <li
                      key={occupancy.id}
                      className="relative flex items-center gap-x-4 px-4 py-3 hover:bg-gray-50 -mx-4"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={
                            occupancy.residentAccount.user.avatar ?? undefined
                          }
                          alt=""
                        />
                        <AvatarFallback>
                          {getInitials(
                            occupancy.residentAccount.user.full_name
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm flex font-semibold text-gray-900">
                          <span className="truncate">
                            {occupancy.residentAccount.user.full_name}
                          </span>
                        </p>
                        <p className="mt-1 flex text-sm text-gray-500">
                          <span className="truncate">
                            {occupancy.residentAccount.user.email}
                          </span>
                        </p>
                        <p className="mt-1 text-sm leading-5 text-gray-500">
                          Ditambahkan pada{" "}
                          <time dateTime={occupancy.created_at.toISOString()}>
                            {formatDateTime(occupancy.created_at)}
                          </time>
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-x-4">
                        <div className="hidden sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm leading-6 text-gray-900"></p>
                          <p className="mt-1 text-xs leading-5 text-gray-500"></p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <DotsThreeVertical
                                weight="bold"
                                className="h-4 w-4"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/housings/${params.housingSlug}/residents/${occupancy.residentAccount.id}`}
                                >
                                  Lihat Penghuni
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem asChild>
                                <RestoreOccupancyButton
                                  housingSlug={params.housingSlug}
                                  propertySlug={params.propertySlug}
                                  occupancyId={occupancy.id}
                                >
                                  Pulihkan Kepenghunian
                                </RestoreOccupancyButton>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
