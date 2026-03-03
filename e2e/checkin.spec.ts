import { test, expect, type Page } from "@playwright/test"

async function login(page: Page) {
    await page.goto("/login")
    await page.getByLabel("E-mail").fill("admin@eventos.com")
    await page.locator('#password').fill("123456")
    await page.getByRole("button", { name: "Entrar" }).click()
    await page.waitForURL("/", { timeout: 10000 })
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 10000 })
}

test.describe("Check-in", () => {
    test.beforeEach(async ({ page }) => {
        await login(page)
    })

    test("should navigate to checkin page", async ({ page }) => {
        await page.goto("/checkin")
        await expect(page.getByRole("heading", { name: "Configuração de Check-in" })).toBeVisible({
            timeout: 10000,
        })
    })

    test("should display event selector", async ({ page }) => {
        await page.goto("/checkin")
        await expect(page.getByText("Selecione o evento")).toBeVisible({ timeout: 10000 })
    })

    test("should show rules for selected event", async ({ page }) => {
        await page.goto("/checkin")
        await expect(page.getByRole("heading", { name: "Configuração de Check-in" })).toBeVisible({
            timeout: 10000,
        })
        // Wait for event data to load and auto-select
        await expect(page.getByText("QR Code")).toBeVisible({ timeout: 10000 })
    })
})
