import { cookies } from "next/headers";

export async function POST() {
  cookies().set("token", "", { path: "/", maxAge: 0 });
  return Response.json({ ok: true });
}