"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api.lib";
import {
  Property,
  UpdatePropertyData,
  updatePropertySchema,
} from "@/schemas/property.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type EditPropertyFormProps = {
  property: Property;
};

export function UpdatePropertyForm({ property }: EditPropertyFormProps) {
  const router = useRouter();
  const params = useParams();

  const updatePropertyForm = useForm<UpdatePropertyData>({
    resolver: zodResolver(updatePropertySchema),
    defaultValues: {
      name: property.name,
    },
  });

  const handleSubmit = updatePropertyForm.handleSubmit(async (data) => {
    await api.put(
      data,
      `/admin/api/housings/${params.housingSlug}/properties/${property.slug}`
    );

    router.refresh();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Properti</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="update-property-form" onSubmit={handleSubmit}>
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                ID Properti
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {property.id}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Nama Properti
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <Input
                  {...updatePropertyForm.register("name")}
                  id="name"
                  disabled={updatePropertyForm.formState.isSubmitting}
                  readOnly={property.archived_at !== null}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Alamat
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                -
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Foto
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                -
              </dd>
            </div>
          </dl>
        </form>
      </CardContent>
      {!property.archived_at && (
        <CardFooter className="justify-end">
          <Button
            type="submit"
            form="update-property-form"
            disabled={updatePropertyForm.formState.isSubmitting}
          >
            Simpan
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
