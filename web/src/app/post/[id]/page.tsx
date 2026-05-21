import { PostThread } from "@/components/social/PostThread";

type Props = { params: Promise<{ id: string }> };

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  return <PostThread postId={id} />;
}
