"use server";

import { type Captcha, createCaptcha } from "@/lib/spam-guard";

export async function getContactCaptcha(): Promise<Captcha> {
  return await createCaptcha();
}
