export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return Response.json({ error: "No file" }, { status: 400 });

  // TEMP: fabricate an id
  const pdfId = `pdf_${Math.random().toString(36).slice(2, 8)}`;

  return Response.json({
    ok: true,
    pdfId,                // <-- MUST exist
    filename: (file as any)?.name || "uploaded.pdf",
    pages: 0,
  });
}
