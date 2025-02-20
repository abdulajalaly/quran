// Remove "use client" so this remains a server component

import AyahDisplay from "@/components/AyahDisplay";

interface AyahPageProps {
  // Adjust the type so that params is a Promise of the expected object.
  params: Promise<{ surah: string; ayah: string }>;
}

export default async function AyahPage({ params }: AyahPageProps) {
  // Await the params so you have the plain object for rendering.
  const resolvedParams = await params;
  return <AyahDisplay params={resolvedParams} />;
}
