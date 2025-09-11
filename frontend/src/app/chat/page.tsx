import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const sessions = [
  { id: "c_101", title: "Explain CNNs like I’m 12", lastMsg: "A CNN learns filters…", updatedAt: "2025-09-11" },
  { id: "c_102", title: "Revise: OS Scheduling vs Deadlocks", lastMsg: "Preemptive vs non-preemptive…", updatedAt: "2025-09-10" },
]

export default function ChatHistoryPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Chats</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search chats…" className="w-56" />
          <Link href="/chat/new">
            <Button>New Chat</Button>
          </Link>
        </div>
      </div>

      <Separator className="mb-5" />

      <div className="space-x-3">
        {sessions.map(s => (
          <Link key={s.id} href={`/chat/${s.id}`}>
            <Card className="transition hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>SN</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <CardTitle className="text-base">{s.title}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {s.lastMsg || "No messages yet"}
                  </CardDescription>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  {new Date(s.updatedAt).toLocaleDateString()}
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {sessions.length === 0 && (
        <Card className="mt-6">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No chats yet. Click <strong>New Chat</strong> to start a conversation.
          </CardContent>
        </Card>
      )}
    </main>
  )
}
