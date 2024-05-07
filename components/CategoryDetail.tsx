// import { ICategory } from "@/typing";

// interface IPropType {
//     category:  ICategory;
// }
//{ category }: IPropType
function CategoryDetail() {
  return (
    <div className="px-6 text-center py-10 w-full md:w-[80%] 2xl:w-[60%] mx-auto mt-5">
      <p className="text-[2rem] lg:text-[2.5rem] 2xl:text-[3rem] font-[500] mb-[1.3rem] font-serif">
        Category: Travel
      </p>
      <div className="w-[180px] mb-[1.3rem] h-[0.9px] mx-auto bg-slate-300"></div>
      <p className="text-[1.3rem] font-[300] font-sans leading-relaxed text-gray-500">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </p>
    </div>
  );
}

export default CategoryDetail;
