import { test, expect, type Page } from "@playwright/test"

async function login(page: Page) {
    await page.goto("/login")
    await page.getByLabel("E-mail").fill("admin@eventos.com")
    await page.locator('#password').fill("123456")
    await page.getByRole("button", { name: "Entrar" }).click()
    await page.waitForURL("/", { timeout: 10000 })
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 10000 })
}

test.describe("Events", () => {
    test.beforeEach(async ({ page }) => {
        await login(page)
    })

    test("should navigate to events page", async ({ page }) => {
        await page.goto("/eventos")
        await expect(page.getByRole("heading", { name: "Eventos" })).toBeVisible({ timeout: 10000 })
        await expect(page.getByText("Gerencie todos os seus eventos")).toBeVisible()
    })

    test("should display events table", async ({ page }) => {
        await page.goto("/eventos")
        await expect(page.getByRole("cell", { name: "Tech Summit 2026" })).toBeVisible({ timeout: 10000 })
    })

    test("should open create event dialog", async ({ page }) => {
        await page.goto("/eventos")
        await expect(page.getByRole("heading", { name: "Eventos" })).toBeVisible({ timeout: 10000 })
        await page.getByRole("button", { name: /Novo Evento/i }).click()
        await expect(page.getByText("Nome do evento")).toBeVisible({ timeout: 5000 })
    })

    test("should filter events by search", async ({ page }) => {
        await page.goto("/eventos")
        await expect(page.getByRole("cell", { name: "Tech Summit 2026" })).toBeVisible({ timeout: 10000 })
        await page.getByPlaceholder("Buscar").fill("Tech Summit")
        await expect(page.getByRole("cell", { name: "Tech Summit 2026" })).toBeVisible()
    })
})
