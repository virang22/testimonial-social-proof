/**
 * emailSimulator.js
 * -----------------
 * In a real production app this would call SendGrid / Nodemailer.
 * For this assessment it simply logs the details to the console so
 * reviewers can see the token / code without needing a mail server.
 */

export function sendVerificationEmail(email, code) {
  console.log('\n========================================');
  console.log(' 📧  EMAIL VERIFICATION SIMULATION');
  console.log(`     To     : ${email}`);
  console.log(`     Code   : ${code}`);
  console.log(`     Expires: 10 minutes`);
  console.log('========================================\n');
}

export function sendPasswordResetEmail(email, token) {
  console.log('\n========================================');
  console.log(' 🔑  PASSWORD RESET SIMULATION');
  console.log(`     To     : ${email}`);
  console.log(`     Token  : ${token}`);
  console.log(`     Expires: 1 hour`);
  console.log('     Link   : http://localhost:5173/reset-password?token=${token}');
  console.log('========================================\n');
}
