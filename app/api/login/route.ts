import { getClientPromise } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const username = (body.username || "").trim();
  const password = body.password || "";

  if (!username || !password) {
    return Response.json({ error: "username dan password wajib" }, { status: 400 });
  }

  const client = await getClientPromise();
  const db = client.db("globalchat");

  const user = await db.collection("users").findOne({ username });
  if (!user) return Response.json({ error: "username/password salah" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return Response.json({ error: "username/password salah" }, { status: 401 });

  const token = signToken({ userId: user._id.toString(), username });

  cookies().set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true, // Railway pakai https
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ ok: true });
}