import { MDXRemoteSerializeResult } from "next-mdx-remote";

export interface IPost {
    id: number,
    attributes: IPostAttribute;
}

export interface IPostAttribute {
    Title: string;
    Slug: string;
    Content: string ;
    MainImage: IImage;
    createdAt: string;
    Author: IAuthor;
    category: ICategory;
    tags: ITags;
}

export interface ICategory {
    data: {
        attributes: {
            Title: string;
            Slug: string;
            description: string;
        }
    }
}

export interface IAuthor {
    data: {
        id?:number;
        attributes:{
            name: string;
            slug: string;
            bio: string;
            image: {
                data: {
                    attributes: {
                        formats: {
                            thumbnail: {
                                url: string;
                            }
                        },
                        url?:string;
                    }
                }
            }
            posts?:IPostAttribute
        }
    }
}

export interface IUser {
    id: number,
    attributes: IUserAttribute;
}

export interface IUserAttribute {
    name: string;
    slug: string;
    email:string;
    bio: string ;
    image: IImage;
    location: string;
    createdAt: string;
    posts: IPost;
}

export interface IUserSession{
    jwt: string,
    user:{
        id: number,
        username:string,
        name:string,
        bio:string,
        email:string,
        location: string

    }
}

export interface ILoginParams {
    username: string,
    password:string
}

export interface IImage {
    data: {
        id: number;
        attributes:{
            url: string;
            formats:{
                thumbnail:{
                    url: string;
                }
            }
        }
    }
}

export interface IPagnation {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}

export interface IMeta {
    pagination: IPagnation;
}

export interface ICollectionResponse<T> {
    data: T;
    meta: IMeta;
}

export type TPage = 1 | -1;

export interface IQueryOptions {
    filters?: any,
    sort?: any,
    populate?: any,
    pagination?: {
        page: number,
        pageSize: number
    }
}
