import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "truzoneverifica564@gmail.com",
    pass: "wuqqzhorrausnirj"
  }
});

export async function sendVerificationEmail(to, code) {
  const message = {
    from: "Truzone <truzoneverifica564@gmail.com>",
    to,
    subject: "Truzone Verification Code",
    html: `<h2>Welcome to Truzone 🎉</h2>
           <p>Your 6-digit verification code is:</p>
           <h1>${code}</h1>
           <p>Keep it safe and private. ✨<br/>This code expires soon.</p>
           <p><i>"Sugar quote: Happiness begins when you step into Truzone 💙💖"</i></p>`
  };
  await transporter.sendMail(message);
}
