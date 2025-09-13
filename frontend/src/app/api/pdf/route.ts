export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  return Response.json({
    id: slug,
    title: `Demo PDF ${slug}`,
    pages: 10,
    createdAt: new Date().toISOString(),
  });
}
