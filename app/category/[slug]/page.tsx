import { getCategoryDetails, getCategoryPosts } from "@/actions";
import { api } from "@/app/api";
import AllBlogs from "@/components/AllBlogs";
import CategoryDetail from "@/components/CategoryDetail";

interface IPropType {
  params: any;
  searchParams: any;
}

export default async function CategoryPage({ params }: any) {
  const { slug } = params;

  const posts = await getCategoryPosts(slug);
  const details = await getCategoryDetails(slug);

  return (
    <>
      <CategoryDetail data={details[0]} />
      <AllBlogs posts={posts} />
    </>
  );
}
