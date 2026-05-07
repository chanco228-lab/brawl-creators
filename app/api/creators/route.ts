import { NextRequest, NextResponse } from "next/server";
import { readCreators, writeCreators } from "@/lib/creators-data";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "brawlcreators";

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("x-admin-password");
  return auth === ADMIN_PASSWORD;
}

export async function GET() {
  return NextResponse.json(readCreators());
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const creator = await req.json();
  const creators = readCreators();
  if (creators.find((c) => c.id === creator.id)) {
    return NextResponse.json({ error: "IDが既に存在します" }, { status: 400 });
  }
  creators.push(creator);
  writeCreators(creators);
  return NextResponse.json({ ok: true });
}
