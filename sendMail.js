const { application } = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "shaurya.attal@gmail.com",
    pass: "oxvbfpeacmwfvdiz",
  },
});

async function sendEmail() {
  const info = await transporter.sendMail({
    from: {
      name: "shaurya",
      address: "shaurya.attal@gmail.com",
    },
    to: ["yamunaakritigowda@gmail.com"],
    subject: "Coding Class",
    text: "Is there class on 16th?",
    html: "<b>hello</b>",
    attachments: [
      {
        filename: "funnyimage.png",
        path: path.join(__dirname, "LOLOLOLOL.png"),
        contentType: "application/png",
      },
    ],
  });

  console.log("Message send:", info.messageId);
}

sendEmail().catch(console.error);
