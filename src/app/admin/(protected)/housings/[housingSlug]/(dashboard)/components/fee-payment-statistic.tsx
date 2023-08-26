"use client";

import { BarChart } from "@tremor/react";

const data = [
  {
    name: "Jan",
    "Total bayar": Math.floor(Math.random() * 50_000_000) + 24_000_000,
  },
  {
    name: "Feb",
    "Total bayar": Math.floor(Math.random() * 50_000_000) + 24_000_000,
  },
  {
    name: "Mar",
    "Total bayar": Math.floor(Math.random() * 50_000_000) + 24_000_000,
  },
  {
    name: "Apr",
    "Total bayar": Math.floor(Math.random() * 50_000_000) + 24_000_000,
  },
  {
    name: "Mei",
    "Total bayar": Math.floor(Math.random() * 50_000_000) + 24_000_000,
  },
  {
    name: "Jun",
    "Total bayar": Math.floor(Math.random() * 50_000_000) + 24_000_000,
  },
  {
    name: "Jul",
    "Total bayar": Math.floor(Math.random() * 50_000_000) + 24_000_000,
  },
  {
    name: "Agu",
    "Total bayar": Math.floor(Math.random() * 50_000_000) + 24_000_000,
  },
  {
    name: "Sep",
    "Total bayar": Math.floor(Math.random() * 50_000_000) + 24_000_000,
  },
  {
    name: "Okt",
    "Total bayar": Math.floor(Math.random() * 50_000_000) + 24_000_000,
  },
  {
    name: "Nov",
    "Total bayar": Math.floor(Math.random() * 50_000_000) + 24_000_000,
  },
  {
    name: "Des",
    "Total bayar": Math.floor(Math.random() * 50_000_000) + 24_000_000,
  },
];

const dataFormatter = (number: number) => {
  return "Rp" + Intl.NumberFormat("id").format(number).toString();
};

export function FeePaymentStatistic() {
  return (
    <div className="px-4">
      <BarChart
        data={data}
        categories={["Total bayar"]}
        index="name"
        colors={["blue"]}
        valueFormatter={dataFormatter}
        yAxisWidth={88}
      />
    </div>
  );
}
