import { prisma } from './prisma'

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function createOtp(phone: string): Promise<string> {
  const code = generateCode()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.otp.updateMany({
    where: { phone, used: false },
    data: { used: true },
  })

  await prisma.otp.create({
    data: { phone, code, expiresAt },
  })

  return code
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const otp = await prisma.otp.findFirst({
    where: { phone, code, used: false, expiresAt: { gt: new Date() } },
  })

  if (!otp) return false

  await prisma.otp.update({
    where: { id: otp.id },
    data: { used: true },
  })

  return true
}

export async function sendOtpSms(phone: string, code: string): Promise<void> {
  const normalized = phone.startsWith('0')
    ? '+254' + phone.slice(1)
    : phone.startsWith('254') ? '+' + phone : phone

  if (process.env.NODE_ENV === 'development') {
    console.log(`[OTP DEV] ${normalized} → ${code}`)
    return
  }

  const params = new URLSearchParams({
    username: process.env.AT_USERNAME!,
    to: normalized,
    message: `Your Sote code is ${code}. Valid 10 minutes. Do not share.`,
    from: process.env.AT_SENDER_ID || 'SOTE',
  })

  await fetch('https://api.africastalking.com/version1/messaging', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'apiKey': process.env.AT_API_KEY!,
    },
    body: params.toString(),
  })
}