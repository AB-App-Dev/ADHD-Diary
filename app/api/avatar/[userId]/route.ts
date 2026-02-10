import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { readFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "avatars");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { userId } = await params;

  if (!session?.user?.id || session.user.id !== userId) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  if (!existsSync(UPLOAD_DIR)) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  const files = await readdir(UPLOAD_DIR);
  const avatarFile = files.find((f) => f.startsWith(userId));

  if (!avatarFile) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  const filepath = path.join(UPLOAD_DIR, avatarFile);
  const ext = path.extname(avatarFile).slice(1);
  const buffer = await readFile(filepath);

  const contentType =
    ext === "jpg" ? "image/jpeg" : ext === "png" ? "image/png" : "image/webp";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
