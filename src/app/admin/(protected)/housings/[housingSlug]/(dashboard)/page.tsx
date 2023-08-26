import { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { CalendarDateRangePicker } from "./components/date-range-picker";
import { FeePaymentStatistic } from "./components/fee-payment-statistic";
import { RecentPayments } from "./components/recent-payments";
import { HomeIcon } from "@radix-ui/react-icons";
import { propertiesTable } from "@/schemas/property.schema";
import { db } from "@/lib/db.lib";
import { eq, isNotNull, sql } from "drizzle-orm";
import { housingFeePaymentsTable } from "@/schemas/housing-fee-payment.schema";
import { housingFeeBillsTable } from "@/schemas/housing-fee-bill.schema";
import { residentAccountsTable } from "@/schemas/resident-account.schema";
import { PageTitle } from "../../../components/page-title";

export const metadata: Metadata = {
  title: "Dasbor",
  description: "",
};

export default async function DashboardPage() {
  const { totalProperties } = await db
    .select({ totalProperties: sql<number>`COUNT(*)` })
    .from(propertiesTable)
    .then((rows) => rows[0]);

  const { totalPaidPayments } = await db
    .select({ totalPaidPayments: sql<number>`COUNT(*)` })
    .from(housingFeePaymentsTable)
    .where(isNotNull(housingFeePaymentsTable.paid_at))
    .then((rows) => rows[0]);

  const { totalAmountPaidPayments } = await db
    .select({ totalAmountPaidPayments: sql<number>`SUM(amount)` })
    .from(housingFeeBillsTable)
    .innerJoin(
      housingFeePaymentsTable,
      eq(housingFeeBillsTable.id, housingFeePaymentsTable.housing_fee_bill_id)
    )
    .where(isNotNull(housingFeePaymentsTable.paid_at))
    .then((rows) => rows[0]);

  const { totalResidents } = await db
    .select({ totalResidents: sql<number>`COUNT(*)` })
    .from(residentAccountsTable)
    .then((rows) => rows[0]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <PageTitle className="text-3xl font-bold tracking-tight">
          Dasbor
        </PageTitle>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Iuran Terbayar
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp{totalAmountPaidPayments}
            </div>
            <p className="text-xs text-muted-foreground">
              Dari total Rp156.312.000
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transaksi Lunas
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPaidPayments}</div>
            <p className="text-xs text-muted-foreground">dari 588 transaksi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Penghuni
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResidents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properti
            </CardTitle>
            <HomeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Statistik Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <FeePaymentStatistic />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Pembayaran Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentPayments />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
