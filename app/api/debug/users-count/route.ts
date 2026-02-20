import { getMongoClientPromise } from "@/lib/mongodb";

export async function GET() {
  const client = await getMongoClientPromise();
  const db = client.db("globalchat");

  const count = await db.collection("users").countDocuments();

  return Response.json({ count });
}