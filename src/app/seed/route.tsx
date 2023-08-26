import { seed } from "@/seeder";

export async function GET() {
  await seed();
}
