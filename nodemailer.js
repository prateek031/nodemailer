const nodemailer = require("nodemailer");
const googleApis = require("googleapis");
const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `take it from google cloud console`;
const CLIENT_SECRET = `take it from google cloud console`;
const REFRESH_TOKEN = `take it from google cloud console `;
const authClient = new googleApis.google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
authClient.setCredentials({ refresh_token: REFRESH_TOKEN });
async function mailer(email, userid, token) {
  try {
        console.log("under try")

        
    const ACCESS_TOKEN = await authClient.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "somthing@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN,
      },        
    });
    const details = {
      from: "PC<somthing@gmail.com>",
      to: email,
      subject: "Wassup ",
      text: "message text",
      html: `<a href="http://localhost:3000/reset/${userid}/${token}"> reset link </a>`,
    };
    const result = await transport.sendMail(details);
    return result;
  } catch (err) {
    return err;
  }
}
mailer().then((res) => {
  console.log("sent mail !", res);
});

module.exports = mailer;
