import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
    test("should redirect unauthenticated user to login", async ({ page }) => {
        await page.goto("/")
        await expect(page).toHaveURL(/\/login/)
    })

    test("should login with valid credentials", async ({ page }) => {
        await page.goto("/login")
        await page.fill('[id="email"]', "admin@eventos.com")
        await page.fill('[id="password"]', "123456")
        await page.click('button[type="submit"]')
        await expect(page).toHaveURL("/")
        await expect(page.getByText("Dashboard")).toBeVisible()
    })

    test("should show error for invalid credentials", async ({ page }) => {
        await page.goto("/login")
        await page.fill('[id="email"]', "wrong@email.com")
        await page.fill('[id="password"]', "wrong")
        await page.click('button[type="submit"]')
        await expect(page.getByText("Credenciais inválidas")).toBeVisible()
    })

    test("should logout successfully", async ({ page }) => {
        // Login first
        await page.goto("/login")
        await page.fill('[id="email"]', "admin@eventos.com")
        await page.fill('[id="password"]', "123456")
        await page.click('button[type="submit"]')
        await expect(page).toHaveURL("/")

        // Logout
        await page.getByText("Administrador").click()
        await page.getByText("Sair").click()
        await expect(page).toHaveURL(/\/login/)
    })
})
