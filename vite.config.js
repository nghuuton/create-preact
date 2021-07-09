import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsconfigPaths from "vite-tsconfig-paths";
import Checker from "vite-plugin-checker";

export default defineConfig({
    plugins: [Checker({ typescript: true }), reactRefresh(), tsconfigPaths({ extensions: ["ts", "tsx", "js", "jsx"] })],
    resolve: {
        alias: {
            react: "preact/compat",
            "react-dom": "preact/compat",
        },
    },
});
