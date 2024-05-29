import BlogCard from "./BlogCard";

function BlogList({ posts }: any) {
  return (
    <>
      <div className="px-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-content-center justify-center  gap-y-8 my-8">
        {posts?.map((post: any) => {
          return <BlogCard post={post} key={post.id} />;
        })}
      </div>
    </>
  );
}

export default BlogList;
