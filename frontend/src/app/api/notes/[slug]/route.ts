import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Fake PDF meta
  const pdf = {
    id: slug,
    title: `Demo Notes for ${slug}`,
    pages: 10,
  };

  // Fake topics + MCQs
  const topics = [
    {
      id: "t1",
      title: "Intro / Overview",
      summary: "• Key idea 1\n• Key idea 2\n• Key idea 3",
      questions: [
        {
          stem: "What is the main motivation?",
          options: ["A", "B", "C", "D"],
          correct: "A",
        },
      ],
    },
    {
      id: "t2",
      title: "Core Concept",
      summary: "• Definition\n• Example\n• Caveats",
      questions: [
        {
          stem: "Which option is correct?",
          options: ["X", "Y", "Z", "W"],
          correct: "Y",
        },
      ],
    },
  ];

  return Response.json({ pdf, topics });
}
