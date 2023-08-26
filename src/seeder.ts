import { auth } from "@/auth/lucia";
import { db } from "@/lib/db.lib";
import { housingDevelopersTable } from "@/schemas/housing-developer.schema";
import { housingDeveloperAccountsTable } from "@/schemas/housing-developer-account.schema";
import { propertiesTable } from "@/schemas/property.schema";
import { housingsTable } from "@/schemas/housing.schema";

export async function seed() {
  await db.transaction(async (tx) => {
    const housingDeveloper = await tx
      .insert(housingDevelopersTable)
      .values({
        name: "PT Example",
        slug: "pt-example",
      })
      .returning({ id: housingDevelopersTable.id })
      .then((res) => res[0]);

    const housing = await tx
      .insert(housingsTable)
      .values({
        name: "Perumahan Example",
        slug: "perumahan-example",
        address: "Jl. Example",
        housing_developer_id: housingDeveloper.id,
      })
      .returning({ id: housingsTable.id })
      .then((res) => res[0]);

    const property = await tx.insert(propertiesTable).values({
      name: "Rumah B3",
      slug: "rumah-b3",
      housing_id: housing.id,
    });

    const housingDeveloperAdminUser = await auth.createUser({
      key: {
        providerId: "email",
        providerUserId: "admin@example.com",
        password: "qwerty123",
      },
      attributes: {
        email: "admin@example.com",
        full_name: "Admin",
        type: "housing_developer",
        verified_at: new Date().toISOString(),
        avatar: null,
      },
    });

    await tx.insert(housingDeveloperAccountsTable).values({
      housing_developer_id: housingDeveloper.id,
      user_id: housingDeveloperAdminUser.userId,
    });

    const endUser = await auth.createUser({
      key: {
        providerId: "email",
        providerUserId: "user@example.com",
        password: "qwerty123",
      },
      attributes: {
        email: "user@example.com",
        full_name: "User",
        type: "resident",
        verified_at: null,
        avatar: null,
      },
    });
  });
}
