import { api } from "@/app/api";
import CategoryDetail from "@/components/CategoryDetail";

interface IPropType {
  params: any;
  searchParams: any;
}

export default async function CategoryPage({
  params,
  searchParams,
}: IPropType) {
  const { slug } = params;

  // const { page } = searchParams;
  // const { data } = await getPosts(slug, page);

  // console.log("page", page);
  // const category = await getCategory(slug);

  // const categoryData = category.data;
  // const posts = data.data;
  // const pagination = data.meta.pagination;

  return (
    <>
      <CategoryDetail />
    </>
  );
}
