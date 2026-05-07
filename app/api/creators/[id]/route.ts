import { NextRequest, NextResponse } from "next/server";
import { readCreators, writeCreators } from "@/lib/creators-data";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "brawlcreators";

function checkAuth(req: NextRequest) {
  return req.headers.get("x-admin-password") === ADMIN_PASSWORD;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const updated = await req.json();
  const creators = readCreators();
  const idx = creators.findIndex((c) => c.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  creators[idx] = updated;
  writeCreators(creators);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const creators = readCreators().filter((c) => c.id !== id);
  writeCreators(creators);
  return NextResponse.json({ ok: true });
}
