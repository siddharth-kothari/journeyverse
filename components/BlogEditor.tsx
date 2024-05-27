import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import FroalaEditor to ensure it's only loaded on the client side
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/char_counter.min.js";
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/emoticons.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/line_height.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/paragraph_format.min.js";
import "froala-editor/js/plugins/quote.min.js";
import "froala-editor/js/plugins/paragraph_style.min.js";
import "froala-editor/js/plugins/special_characters.min.js";
import "froala-editor/js/third_party/spell_checker.min.js";
import "froala-editor/js/plugins/table.min.js";

const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), {
  ssr: false,
});

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

const BlogEditor = ({ content, setContent }: any) => {
  return (
    <FroalaEditor
      model={content}
      onModelChange={setContent}
      config={{
        placeholderText: "Write...",
        charCounterCount: true,
      }}
    />
  );
};

export default BlogEditor;
