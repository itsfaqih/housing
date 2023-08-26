import { PageTitle } from "@/app/admin/(protected)/components/page-title";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db.lib";
import { residentAccountsTable } from "@/schemas/resident-account.schema";
import { formatDateTime } from "@/utils/date.util";
import { getInitials } from "@/utils/text.util";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, DotsThreeVertical, Plus } from "phosphor-react-sc";
import Link from "next/link";
import { DeleteResidentAccountDialog } from "../components/delete-resident-account-dialog";
import { RestoreResidentAccountDialog } from "../components/restore-resident-account-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteOccupancyButton } from "../../components/delete-occupancy-button";
import { RestoreOccupancyButton } from "../../components/restore-occupancy-button";
import { CreateResidentOccupancyCombobox } from "./components/create-resident-occupancy-combobox";

export const metadata: Metadata = {
  title: "Detail Penghuni",
  description: "",
};

type ResidentAccountDetailPageProps = {
  params: {
    housingSlug: string;
    residentAccountId: string;
  };
};

export default async function ResidentAccountDetailPage({
  params,
}: ResidentAccountDetailPageProps) {
  const residentAccount = await db.query.residentAccountsTable.findFirst({
    where: eq(residentAccountsTable.id, Number(params.residentAccountId)),
    with: {
      user: {
        columns: {
          id: true,
          full_name: true,
          email: true,
          avatar: true,
          archived_at: true,
        },
      },
      propertyOccupancies: {
        columns: {
          id: true,
          created_at: true,
          deleted_at: true,
        },
        with: {
          property: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!residentAccount) {
    return notFound();
  }

  const activeOccupancies = residentAccount.propertyOccupancies.filter(
    (occupancy) => occupancy.deleted_at === null
  );

  const pastOccupancies = residentAccount.propertyOccupancies.filter(
    (occupancy) => occupancy.deleted_at !== null
  );

  return (
    <div>
      <Button variant="ghost" asChild>
        <Link href={`/admin/housings/${params.housingSlug}/residentAccounts`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Link>
      </Button>
      <div className="flex items-center justify-between mt-4">
        <PageTitle>
          Detail Penghuni - {residentAccount.user.full_name}
        </PageTitle>
        <div className="flex items-center space-x-2">
          {residentAccount.deleted_at ? (
            <RestoreResidentAccountDialog
              residentAccountId={residentAccount.id}
              residentFullName={residentAccount.user.full_name}
            >
              <Button variant="secondary">Pulihkan Penghuni</Button>
            </RestoreResidentAccountDialog>
          ) : (
            <DeleteResidentAccountDialog
              residentAccountId={residentAccount.id}
              residentFullName={residentAccount.user.full_name}
            >
              <Button variant="destructive">Hapus Penghuni</Button>
            </DeleteResidentAccountDialog>
          )}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Penghuni</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Foto
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={residentAccount.user.avatar ?? undefined}
                        alt="Avatar"
                      />
                      <AvatarFallback>
                        {getInitials(residentAccount.user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Nama Lengkap
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {residentAccount.user.full_name}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {residentAccount.user.email}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Properti yang dihuni</CardTitle>
                <CreateResidentOccupancyCombobox />
              </div>
            </CardHeader>
            <CardContent>
              {activeOccupancies.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm leading-5 text-gray-500">
                    Belum ada properti yang ditambahkan.
                  </p>
                </div>
              )}
              {activeOccupancies.length > 0 && (
                <ul role="list" className="divide-y divide-gray-100">
                  {activeOccupancies.map((occupancy) => (
                    <li
                      key={occupancy.id}
                      className="relative flex justify-between gap-x-4 px-4 py-3 hover:bg-gray-50 -mx-4"
                    >
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          <span className="truncate">
                            {occupancy.property.name}
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
                                href={`/admin/housings/${params.housingSlug}/properties/${occupancy.property.slug}`}
                              >
                                Lihat Properti
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                              <DeleteOccupancyButton
                                housingSlug={params.housingSlug}
                                propertySlug={occupancy.property.slug}
                                occupancyId={occupancy.id}
                              >
                                Hapus Properti dari Penghuni
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
              <CardTitle>Riwayat properti yang dihuni</CardTitle>
            </CardHeader>
            <CardContent>
              {pastOccupancies.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm leading-5 text-gray-500">
                    Belum ada properti.
                  </p>
                </div>
              )}
              {pastOccupancies.length > 0 && (
                <ul role="list" className="divide-y divide-gray-100">
                  {pastOccupancies.map((occupancy) => (
                    <li
                      key={occupancy.id}
                      className="relative flex justify-between gap-x-4 px-4 py-3 hover:bg-gray-50 -mx-4"
                    >
                      <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900">
                            {occupancy.property.name}
                          </p>
                          <p className="mt-1 text-sm leading-5 text-gray-500">
                            Ditambahkan pada{" "}
                            <time dateTime={occupancy.created_at.toISOString()}>
                              {formatDateTime(occupancy.created_at)}
                            </time>
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center">
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
                                  href={`/admin/housings/${params.housingSlug}/properties/${occupancy.property.slug}`}
                                >
                                  Lihat Properti
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem asChild>
                                <RestoreOccupancyButton
                                  housingSlug={params.housingSlug}
                                  propertySlug={occupancy.property.slug}
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
