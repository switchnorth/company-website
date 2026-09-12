import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { getAdminAppointmentsApiResponse } from "@/lib/admin/api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  const response = await getAdminAppointmentsApiResponse(admin, request.url);

  return NextResponse.json(response.body, { status: response.status });
}
