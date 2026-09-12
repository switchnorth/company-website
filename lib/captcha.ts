export type CaptchaVerificationResult = {
  configured: boolean;
  valid: boolean;
};

export async function verifyCaptchaToken(
  token: FormDataEntryValue | null,
): Promise<CaptchaVerificationResult> {
  void token;

  if (!process.env.CAPTCHA_SECRET_KEY) {
    return {
      configured: false,
      valid: true,
    };
  }

  // Future integration point: verify the token with the selected CAPTCHA provider.
  return {
    configured: true,
    valid: false,
  };
}
