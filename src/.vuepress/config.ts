import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "TOMMY",
  description: "TOMMY 的小窝",

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
