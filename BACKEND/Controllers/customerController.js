const db = require("../mysql");
const bcrypt = require("bcrypt");
const { createTokens } = require("../JWT");

exports.addCustomer = async (req, res, next) => {
  console.log(req.body);
  const { name, email, phone, password, gender } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const sql =
    "INSERT INTO customers (email,name,phone,password,gender) VALUES (?,?,?,?,?)";
  db.query(sql, [email, name, phone, hashPassword, gender], (err, result) => {
    if (err) {
      console.error("Error inserting customer details:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          status: false,
          type: "Sign Up",
          message: "User Already Registered",
        });
      } else {
        console.log("error");
        return res
          .status(500)
          .json({ status: false, message: "Error inserting customer details" });
      }
    }
    return res.status(200).json({
      status: true,
      type: "Sign Up",
      message: "Sign Up Successfull",
    });
  });
};

exports.getCustomer = (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;

  const sql = `
    SELECT email, password
    FROM customers 
    WHERE email = ?
  `;

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: false, message: "Error in finding user" });
    }
    if (result.length === 0) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const userdata = result[0];
    console.log(userdata.password);

    bcrypt
      .compare(password, userdata.password)
      .then((match) => {
        if (!match) {
          return res
            .status(400)
            .json({ status: false, message: "Invalid Password" });
        }

        const accessToken = createTokens(userdata);

        return res.status(200).json({ status: true, userdata, accessToken });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .json({ status: false, message: "Error in password comparison" });
      });
  });
};

exports.sendSupportMessage = (req, res) => {
  console.log(req.body);
  const support = req.body;
  const sql =
    "INSERT INTO reviews (email,name,mobile,city,feedbackType,message) VALUES(?,?,?,?,?,?)";
  db.query(
    sql,
    [
      support.email,
      support.name,
      support.mobile,
      support.city,
      support.feedback,
      support.message,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting review details:", err);
        return res
          .status(500)
          .json({ status: false, error: "Error inserting review details" });
      }
      return res.status(200).json({
        status: true,
        type: "Review",
        message: "Review added Successfully",
      });
    }
  );
};

exports.getSupport = (req, res) => {
  const sql =
    "SELECT email,name,message FROM reviews ORDER BY created_at DESC LIMIT 5";
  db.query(sql, (err, result) => {
    if (err) {
      return res
        .status(404)
        .json({ status: false, message: "Error in Finding User" });
    }
    return res.status(200).json({ status: true, result });
  });
};

const nodemailer = require("nodemailer");

exports.addBooking = (req, res) => {
  const {
    name,
    mobile,
    email,
    pickDate,
    pickLocation,
    pickTime,
    dropCity,
    comment,
  } = req.body;

  const sql =
    "INSERT INTO bookings(name, mobile, email, pick_date, pick_location, pick_time, drop_city, comment) VALUES (?,?,?,?,?,?,?,?)";

  db.query(
    sql,
    [name, mobile, email, pickDate, pickLocation, pickTime, dropCity, comment],
    (err, result) => {
      if (err) {
        console.error("Error in Booking:", err);
        return res
          .status(500)
          .json({ status: false, error: "Error in Booking" });
      }

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.MAIL_ID,
        to: email,
        subject: "Booking Confirmation",
        html: `
          <h1>Booking Confirmation</h1>
          <p>Dear ${name},</p>
          <p>Your ride has been successfully booked.</p>
          <h3>Booking Details:</h3>
          <ul>
            <li>Pick-up Date: ${pickDate}</li>
            <li>Pick-up Location: ${pickLocation}</li>
            <li>Pick-up Time: ${pickTime}</li>
            <li>Drop City: ${dropCity}</li>
            <li>Comments: ${comment}</li>
          </ul>
          <p>Thank you for choosing our service!</p>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({
            status: false,
            error: "Booking confirmed but failed to send email",
          });
        }
        console.log("Email sent: " + info.response);

        return res.status(200).json({
          status: true,
          type: "Booking",
          message: "Ride Successfully Booked and Email Sent",
        });
      });
    }
  );
};
