import { IPost } from "@/typing";
// import { serialize } from "next-mdx-remote/serialize";

export const debounce = (fn: () => void, timeout = 300) => {
  let timer: NodeJS.Timeout;

  const debounced = (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, timeout);
  };

  return debounced;
};

export const computeSHA256 = async (file: any) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
};

// export const serializeMarkdown = async ( item : IPost) => {
//     const Content = await serialize(item.attributes.Content as string);

//     return {
//         ...item,
//         attributes:{
//             ...item.attributes,
//             Content,
//         }
//     }
// }
