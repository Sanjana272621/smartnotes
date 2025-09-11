import { Note, ChatSession } from "./types";

export const dummyNotes: Note[] = [
  { id: "1", title: "Machine Learning Basics", pages: 25, createdAt: "2025-09-10" },
  { id: "2", title: "Operating Systems Notes", pages: 30, createdAt: "2025-09-09" }
];

export const dummyChats: ChatSession[] = [
  { id: "101", title: "Explain CNNs", lastMsg: "A CNN is a...", updatedAt: "2025-09-11" },
  { id: "102", title: "Revision Plan", lastMsg: "Focus on...", updatedAt: "2025-09-10" }
];