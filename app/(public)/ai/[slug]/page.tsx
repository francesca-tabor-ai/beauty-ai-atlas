export default async function AIPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div>
      <h1>AI: {slug}</h1>
    </div>
  );
}

