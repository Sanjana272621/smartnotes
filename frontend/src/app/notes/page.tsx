"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NotesUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onUpload() {
    try {
      if (!file) return;
      setBusy(true);

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));

      console.log("UPLOAD RESP:", res.status, data); // <— see what came back

      if (!res.ok || !data?.pdfId) {
        alert(data?.error || "Upload failed: missing pdfId");
        setBusy(false);
        return;
      }

      // Use encodeURIComponent in case ids have special chars
      router.push(`/notes/${encodeURIComponent(data.pdfId)}`);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Unexpected error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Upload a PDF to Generate Notes</h1>
      <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <Button onClick={onUpload} disabled={!file || busy}>
        {busy ? "Processing..." : "Upload"}
      </Button>
    </div>
  );
}
