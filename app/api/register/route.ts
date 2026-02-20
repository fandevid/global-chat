import { getClientPromise } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const username = (body.username || "").trim();
  const password = body.password || "";

  if (!username || !password) {
    return Response.json({ error: "username dan password wajib" }, { status: 400 });
  }

  const client = await getClientPromise();
  const db = client.db("globalchat");

  const existing = await db.collection("users").findOne({ username });
  if (existing) return Response.json({ error: "username sudah dipakai" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  await db.collection("users").insertOne({ username, passwordHash, createdAt: new Date() });

  return Response.json({ ok: true }, { status: 201 });
}