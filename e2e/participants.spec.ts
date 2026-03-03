import { test, expect, type Page } from "@playwright/test"

async function login(page: Page) {
    await page.goto("/login")
    await page.getByLabel("E-mail").fill("admin@eventos.com")
    await page.locator('#password').fill("123456")
    await page.getByRole("button", { name: "Entrar" }).click()
    await page.waitForURL("/", { timeout: 10000 })
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 10000 })
}

test.describe("Participants", () => {
    test.beforeEach(async ({ page }) => {
        await login(page)
    })

    test("should navigate to participants page", async ({ page }) => {
        await page.goto("/participantes")
        await expect(page.getByRole("heading", { name: "Participantes" })).toBeVisible({ timeout: 10000 })
        await expect(page.getByText("Gerencie os participantes dos seus eventos")).toBeVisible()
    })

    test("should display participants table", async ({ page }) => {
        await page.goto("/participantes")
        await expect(page.getByRole("cell", { name: "Ana Silva" })).toBeVisible({ timeout: 10000 })
    })

    test("should filter participants by search", async ({ page }) => {
        await page.goto("/participantes")
        await expect(page.getByRole("cell", { name: "Ana Silva" })).toBeVisible({ timeout: 10000 })
        await page.getByPlaceholder("Buscar").fill("Ana")
        await expect(page.getByRole("cell", { name: "Ana Silva" })).toBeVisible()
    })
})
