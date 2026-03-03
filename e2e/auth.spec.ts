import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
    test("should redirect unauthenticated user to login", async ({ page }) => {
        await page.goto("/")
        await page.waitForURL(/\/login/)
        await expect(page).toHaveURL(/\/login/)
    })

    test("should login with valid credentials", async ({ page }) => {
        await page.goto("/login")
        await page.getByLabel("E-mail").fill("admin@eventos.com")
        await page.locator('#password').fill("123456")
        await page.getByRole("button", { name: "Entrar" }).click()
        await page.waitForURL("/", { timeout: 10000 })
        await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 10000 })
    })

    test("should show error for invalid credentials", async ({ page }) => {
        await page.goto("/login")
        await page.getByLabel("E-mail").fill("wrong@email.com")
        await page.locator('#password').fill("wrong")
        await page.getByRole("button", { name: "Entrar" }).click()
        await expect(page.getByText("Credenciais inválidas")).toBeVisible({ timeout: 5000 })
    })

    test("should logout successfully", async ({ page }) => {
        // Login first
        await page.goto("/login")
        await page.getByLabel("E-mail").fill("admin@eventos.com")
        await page.locator('#password').fill("123456")
        await page.getByRole("button", { name: "Entrar" }).click()
        await page.waitForURL("/", { timeout: 10000 })
        await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 10000 })

        // Logout
        await page.getByRole("button", { name: "Administrador" }).click()
        await page.getByText("Sair").click()
        await page.waitForURL(/\/login/, { timeout: 5000 })
        await expect(page).toHaveURL(/\/login/)
    })
})
