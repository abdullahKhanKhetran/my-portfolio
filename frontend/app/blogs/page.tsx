import { Metadata } from "next";
import BlogList from "../../components/BlogList";

export const metadata: Metadata = {
  title: "Blog | Abdullah Khan",
  description:
    "Field notes from Abdullah Khan — building software, testing AI tooling, and lessons from real projects.",
};

export default function BlogsPage() {
  return <BlogList />;
}
