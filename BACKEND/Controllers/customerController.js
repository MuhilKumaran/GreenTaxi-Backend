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

// exports.getCustomer = (req, res, next) => {
//   console.log(req.body);
//   const {  email, password } = req.body;

//   const sql = `
//   SELECT email,password
//   FROM customers
//   WHERE email = ?
// `;

//   db.query(sql, [email], (err, result) => {
//     if (err) {
//       console.log(err);
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Error in  Finding  User" });
//     }
//     if (result.length === 0) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "User not found" });
//     }
//     const userdata = result[0];
//     console.log(userdata.password);
//     bcrypt.compare(password, userdata.password).then((match) => {
//       console.log(match);
//       if (!match) {
//         return res
//           .status(400)
//           .json({ status: "fail", message: "Invalid Password" });
//       }
//       const accessToken = createTokens(userdata);
//       //expire after 30 days
//       console.log("acc  " + accessToken);
//       res.cookie("access-token", accessToken, {
//         maxAge: 60 * 60 * 24 * 30 * 1000,
//         httpOnly: true,
//       });

//       return res.status(200).json({ userdata, accessToken });
//     });
//   });
// };
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

    // Compare the password with the hashed password in DB
    bcrypt
      .compare(password, userdata.password)
      .then((match) => {
        if (!match) {
          return res
            .status(400)
            .json({ status: false, message: "Invalid Password" });
        }

        // If password matches, create a JWT
        const accessToken = createTokens(userdata);

        // Return the JWT in the response body (no cookies)
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
