import { test, expect } from "@playwright/test"

async function login(page: import("@playwright/test").Page) {
    await page.goto("/login")
    await page.fill('[id="email"]', "admin@eventos.com")
    await page.fill('[id="password"]', "123456")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL("/")
}

test.describe("Participants", () => {
    test.beforeEach(async ({ page }) => {
        await login(page)
    })

    test("should navigate to participants page", async ({ page }) => {
        await page.getByText("Participantes").click()
        await expect(page).toHaveURL("/participantes")
        await expect(
            page.getByText("Gerencie os participantes dos seus eventos")
        ).toBeVisible()
    })

    test("should display participants table", async ({ page }) => {
        await page.goto("/participantes")
        await expect(page.getByText("Ana Silva")).toBeVisible()
    })

    test("should filter participants by search", async ({ page }) => {
        await page.goto("/participantes")
        await page.getByPlaceholder("Buscar").fill("Ana")
        await expect(page.getByText("Ana Silva")).toBeVisible()
    })
})
