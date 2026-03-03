import { test, expect } from "@playwright/test"

// Helper: login antes de cada teste
async function login(page: import("@playwright/test").Page) {
    await page.goto("/login")
    await page.fill('[id="email"]', "admin@eventos.com")
    await page.fill('[id="password"]', "123456")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL("/")
}

test.describe("Events", () => {
    test.beforeEach(async ({ page }) => {
        await login(page)
    })

    test("should navigate to events page", async ({ page }) => {
        await page.getByText("Eventos").click()
        await expect(page).toHaveURL("/eventos")
        await expect(page.getByText("Gerencie todos os seus eventos")).toBeVisible()
    })

    test("should display events table", async ({ page }) => {
        await page.goto("/eventos")
        await expect(page.getByText("Tech Summit 2026")).toBeVisible()
    })

    test("should open create event dialog", async ({ page }) => {
        await page.goto("/eventos")
        await page.getByText("Novo Evento").click()
        await expect(page.getByText("Nome do evento")).toBeVisible()
    })

    test("should filter events by search", async ({ page }) => {
        await page.goto("/eventos")
        await page.getByPlaceholder("Buscar").fill("Tech Summit")
        await expect(page.getByText("Tech Summit 2026")).toBeVisible()
    })
})
