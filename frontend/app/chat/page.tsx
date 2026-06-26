import { notFound } from "next/navigation";
import { FEATURE_FLAGS } from "../../lib/featureFlags";

export default function ChatPage() {
  if (!FEATURE_FLAGS.chat) {
    notFound();
  }

  return null;
}
