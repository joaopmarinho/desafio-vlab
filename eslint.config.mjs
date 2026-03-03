import nextConfig from "eslint-config-next"

const eslintConfig = [
    ...nextConfig,
    {
        ignores: ["e2e/**", "playwright.config.ts"],
    },
]

export default eslintConfig
