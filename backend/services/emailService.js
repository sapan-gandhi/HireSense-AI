const nodemailer = require('nodemailer')

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString()

const sendVerificationEmail = async (email, name, code) => {
  const { EMAIL_USER, EMAIL_PASS } = process.env

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#0B1020;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:480px;margin:40px auto;background:#12182B;border-radius:16px;overflow:hidden;border:1px solid rgba(109,93,246,.3);">
        <div style="background:linear-gradient(135deg,#6D5DF6,#38BDF8);padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">
            AI Career Intelligence Copilot ✦
          </h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,.8);font-size:13px;">Email Verification</p>
        </div>
        <div style="padding:32px;">
          <p style="color:#CBD5E1;font-size:15px;margin:0 0 8px;">Hi <strong style="color:#fff;">${name}</strong> 👋</p>
          <p style="color:#94A3B8;font-size:14px;margin:0 0 28px;line-height:1.6;">
            Thanks for signing up. Enter this 6-digit code to verify your email and activate your account.
          </p>
          <div style="text-align:center;margin:0 0 28px;">
            <div style="display:inline-block;background:#0B1020;border:2px solid rgba(109,93,246,.5);border-radius:14px;padding:20px 40px;">
              <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#A78BFA;font-family:'Courier New',monospace;">${code}</span>
            </div>
            <p style="color:#64748B;font-size:12px;margin:10px 0 0;">Expires in <strong>15 minutes</strong></p>
          </div>
          <p style="color:#64748B;font-size:12px;line-height:1.6;margin:0;border-top:1px solid rgba(255,255,255,.08);padding-top:20px;">
            If you did not create this account, you can safely ignore this email.<br>
            This code is valid for one-time use only.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  // ── No credentials → dev mode ─────────────────────────
  if (!EMAIL_USER || !EMAIL_PASS || EMAIL_PASS === 'your_gmail_app_password_16chars') {
    console.log('\n─────────────────────────────────────')
    console.log('📧  EMAIL VERIFICATION (Dev Mode — no Gmail credentials set)')
    console.log(`To:   ${email}`)
    console.log(`Name: ${name}`)
    console.log(`Code: ${code}`)
    console.log('─────────────────────────────────────\n')
    return { dev: true, code }
  }

  // ── Gmail SMTP ────────────────────────────────────────
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,           // SSL on port 465
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,     // 16-char Gmail App Password (no spaces)
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  try {
    await transporter.verify()
    console.log(`✅ Gmail SMTP connected — sending OTP to ${email}`)
  } catch (verifyErr) {
    console.error('❌ Gmail SMTP verify failed:', verifyErr.message)
    // Fall back to console so signup doesn't break
    console.log(`\n📧 FALLBACK — OTP for ${email}: ${code}\n`)
    return { dev: true, code }
  }

  await transporter.sendMail({
    from: `"AI Career Copilot" <${EMAIL_USER}>`,
    to: email,
    subject: `${code} is your AI Career Copilot verification code`,
    html,
    text: `Your verification code is: ${code}\n\nExpires in 15 minutes.`,
  })

  console.log(`✅ OTP email sent to ${email}`)
  return { sent: true }
}

module.exports = { generateCode, sendVerificationEmail }
