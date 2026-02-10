import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "avatars");
const MAX_SIZE = 250 * 1024; // 250KB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Keine Datei ausgewählt" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Nur JPG, PNG oder WebP erlaubt" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Datei zu groß (max. 250KB)" }, { status: 400 });
  }

  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  // Delete old avatar files for this user
  const existingFiles = await readdir(UPLOAD_DIR);
  for (const f of existingFiles) {
    if (f.startsWith(session.user.id)) {
      await unlink(path.join(UPLOAD_DIR, f));
    }
  }

  const ext = file.type.split("/")[1];
  const filename = `${session.user.id}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: `/api/avatar/${session.user.id}` },
  });

  return NextResponse.json({ success: true, url: `/api/avatar/${session.user.id}` });
}
