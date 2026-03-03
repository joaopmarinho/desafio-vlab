import { test, expect } from "@playwright/test"

async function login(page: import("@playwright/test").Page) {
    await page.goto("/login")
    await page.fill('[id="email"]', "admin@eventos.com")
    await page.fill('[id="password"]', "123456")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL("/")
}

test.describe("Check-in", () => {
    test.beforeEach(async ({ page }) => {
        await login(page)
    })

    test("should navigate to checkin page", async ({ page }) => {
        await page.getByText("Check-in").click()
        await expect(page).toHaveURL("/checkin")
        await expect(
            page.getByText("Configuração de Check-in")
        ).toBeVisible()
    })

    test("should display event selector", async ({ page }) => {
        await page.goto("/checkin")
        await expect(page.getByText("Selecione o evento")).toBeVisible()
    })

    test("should show rules for selected event", async ({ page }) => {
        await page.goto("/checkin")
        // The first event should be auto-selected
        await expect(page.getByText("QR Code")).toBeVisible({ timeout: 5000 })
    })
})
