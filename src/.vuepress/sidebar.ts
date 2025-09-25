import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/业务流程管理/": [
    {
      text: "业务流程管理",
      icon: "book",
      // prefix: "/",
      children: "structure"
    },
  ],
  "/前端技术/": [
    {
      text: "前端技术",
      icon: "book",
      // prefix: "前端技术/",
      children: "structure",
    }
  ],
  "/后端技术/": [
    {
      text: "后端技术",
      icon: "book",
      // prefix: "后端技术/",
      children: "structure",
    }
  ],
  "/流程挖掘/": [
    {
      text: "流程挖掘",
      icon: "book",
      // prefix: "流程挖掘/",
      children: "structure",
    }
  ],
  "/随笔/": [
    {
      text: "随笔",
      icon: "book",
      // prefix: "随笔/",
      children: "structure",
    }
  ],
  // "/": [
  //   // {
  //   //   text: "文章",
  //   //   icon: "book",
  //   //   prefix: "posts/",
  //   //   children: "structure",
  //   // },
  // ],
});
