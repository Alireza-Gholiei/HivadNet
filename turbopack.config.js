import { defineTurbopack } from "next/dist/experimental/turbopack/config";

/** @type {import('next/dist/experimental/turbopack/config').TurbopackConfig} */
export default defineTurbopack({
    resolveAlias: {
        "@": "./",
    },
});
