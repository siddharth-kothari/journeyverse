import React from "react";

const SinglePostPage = async ({ params }: any) => {
  const { slug } = params;
  return <div>{slug}</div>;
};

export default SinglePostPage;
