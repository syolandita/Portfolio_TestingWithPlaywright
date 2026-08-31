import { test, expect } from '@playwright/test';
import { MailSlurp } from 'mailslurp';

test('register dengan data yang valid', async ({ page }) => {
  // Navigate to registration page
  await page.goto('https://internal.citigov.id/register');

  // Fill registration form
  await page.fill('[placeholder="Masukkan nama lengkap"]', 'puput ayu');
  await page.fill('[placeholder="Kata sandi"]', 'Abcd123@');
  await page.fill('[placeholder="Masukkan email"]', 'afteryouleave99@gmail.com');
  await page.fill('[placeholder="Konfirmasi Kata sandi"]', 'Abcd123@');
  await page.fill('[placeholder="Masukkan nomor telepon /"]', '8500000000');
  await page.click('button:has-text("Daftar")');

  // Wait for and receive OTP email
  const mailSlurp = new MailSlurp();
  const email = await mailSlurp.waitForLatestEmail({
    subject: 'Verifikasi OTP Pendaftaran Akun Citigov',
    timeout: 60000, // 60 seconds
  });

  // Extract OTP code from email
  const otpCode = email.body.match(/(\d{4})/)[1];

  // Enter OTP code and submit
  await page.click('button:has-text("Selanjutnya")');
  await page.click('h1:has-text(" Verifikasi OTP")');
  await page.fill('[placeholder="Masukkan Kode OTP"]', otpCode);
  await page.click('button:has-text("Verifikasi")');

  // Verify the next page
  //await expect(page).toHaveURL('https://internal.citigov.id/success');
});
