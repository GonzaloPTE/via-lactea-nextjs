import unusedImports from "eslint-plugin-unused-imports";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

// Define ignored directories
const ignoredPatterns = [
    "**/node_modules/**",
    "**/.next/**",
    "**/.open-next/**",
    "**/out/**",
    "**/.vercel/**",
];

export default [
    // Base ESLint configuration
    {
        ignores: ignoredPatterns
    },
    
    // Add Next.js config via compat adapter
    ...compat.config({ extends: ["next/core-web-vitals"] }),
    
    // Add your custom config
    {
        plugins: {
            "unused-imports": unusedImports,
        },
        rules: {
            "@next/next/no-img-element": 0,
            "react/no-unescaped-entities": 0,
            "import/no-anonymous-default-export": 0,
            "unused-imports/no-unused-imports": "warn",
        }
    }
];