import { IPost } from "@/typing";
import { serialize } from "next-mdx-remote/serialize";


export const debounce = (fn:()=>void,timeout = 300) => {
    let timer: NodeJS.Timeout;

    const debounced = (...args:any) =>{
        clearTimeout(timer);
        timer = setTimeout(()=>{
            fn.apply(this, args);
        }, timeout)
    }


    return debounced;
} 

export const serializeMarkdown = async ( item : IPost) => {
    const Content = await serialize(item.attributes.Content as string);

    return {
        ...item,
        attributes:{
            ...item.attributes,
            Content,
        }
    }
}