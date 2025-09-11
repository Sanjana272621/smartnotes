import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Fake data (swap with real fetch later)
const notes = [
  { id: "doc_1", title: "Machine Learning Basics", pages: 28, createdAt: "2025-09-10" },
  { id: "doc_2", title: "Operating Systems — Scheduling", pages: 17, createdAt: "2025-09-09" },
  { id: "doc_3", title: "DBMS Indexing Cheatsheet", pages: 9,  createdAt: "2025-09-07" },
]

export default function NotesPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">My Notes</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search notes…" className="w-56" />
          <Link href="/notes/new">
            <Button>Upload PDF</Button>
          </Link>
        </div>
      </div>

      <Separator className="mb-5" />

      <div className="grid gap-4 sm:grid-cols-2">
        {notes.map(n => (
          <Link key={n.id} href={`/notes/${n.id}`}>
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle className="line-clamp-1">{n.title}</CardTitle>
                <CardDescription>
                  <span className="mr-2 text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                  <Badge variant="secondary">{n.pages} pages</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Topic breakdown + MCQs generated per chunk.
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {notes.length === 0 && (
        <Card className="mt-6">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No notes yet. Click <strong>Upload PDF</strong> to get started.
          </CardContent>
        </Card>
      )}
    </main>
  )
}
