import { notFound } from "next/navigation";

async function fetchNotes(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/notes/${slug}`, { cache: "no-store" }).catch(() => null);
  if (!res || !res.ok) return null;
  return res.json();
}

export default async function NotesPage({ params }: { params: { slug: string } }) {
  const data = await fetchNotes(params.slug);
  if (!data) return notFound();

  const { pdf, topics } = data;
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">{pdf.title} — Notes</h1>
      {/* render topics… */}
    </div>
  );
}
