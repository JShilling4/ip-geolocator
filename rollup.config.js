import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import autoPreprocess from "svelte-preprocess";
import dotenv from "dotenv";
import replace from "@rollup/plugin-replace";
import livereload from "rollup-plugin-livereload";
import { terser } from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-css-only";

dotenv.config();

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );
      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.ts",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:

    // handle env variables
    replace({
      globalThis: JSON.stringify({
        env: {
          isProd: production,
          API_KEY_IPIFY: JSON.stringify(process.env.API_KEY_IPIFY),
          API_KEY_MAPBOX: JSON.stringify(process.env.API_KEY_MAPBOX),
        },
      }),
      preventAssignment: true,
    }),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
      preprocess: autoPreprocess({
        // make scss files global
        scss: {
          prependData: `
						@import "src/scss/_mixins.scss";
					`,
        },
      }),
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    commonjs(),
    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),
    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),
    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
    json(),
  ],
  watch: {
    clearScreen: false,
  },
};
