const db = require("../mysql");
const bcrypt = require("bcrypt");

exports.checksignUpBody = (req, res, next) => {
  console.log(req.body);
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.phone ||
    !req.body.gender
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Some fileds are missing",
    });
  }
  next();
};

exports.addCustomer = async (req, res, next) => {
  console.log(req.body);
  const { name, email, phone, password, gender } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const sql =
    "INSERT INTO greentaxi.customers (email,name,phone,password,gender) VALUES (?,?,?,?,?)";
  db.query(sql, [email, name, phone, hashPassword, gender], (err, result) => {
    if (err) {
      console.error("Error inserting customer details:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          status: "fail",
          type: "Sign Up",
          message: "User Already Registered",
        });
      } else {
        console.log("error");
        return res
          .status(500)
          .json({ message: "Error inserting customer details" });
      }
    }
    return res.status(200).json({
      status: "success",
      type: "Sign Up",
      message: "Sign Up Successfull",
    });
  });
};

exports.checkLoginBody = (req, res, next) => {
  const { userType, email, password } = req.body;
  if (!email || !password || !userType) {
    return res.status(400).json({
      status: "fail",
      message: "Some fileds are missing",
    });
  }
  next();
};

exports.getCustomer = (req, res, next) => {
  console.log(req.body);
  const { userType, email, password } = req.body;

  const sql = `
  SELECT email,password
  FROM greentaxi.${req.body.userType} 
  WHERE email = ?
`;

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(404)
        .json({ status: "fail", message: "Error in  Finding  User" });
    }
    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }
    const userdata = result[0];
    console.log(userdata.password);
    bcrypt.compare(password, userdata.password).then((match) => {
      console.log(match);
      if (!match) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid Password" });
      }
      const acccessToken = createTokens(userdata);
      //expire after 30 days
      res.cookie("access-token", acccessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });
      return res.status(200).json(userdata);
    });
  });
};

exports.sendSupportMessage = (req, res, next) => {
  console.log(req.body);
  const support = req.body;
  const sql =
    "INSERT INTO greentaxi.reviews (mail_Id,user_name,review_type,details) VALUES(?,?,?,?)";
  db.query(
    sql,
    [
      support.email,
      support.name,
      support.feedbackType,
      JSON.stringify(support),
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting review details:", err);
        return res
          .status(500)
          .json({ error: "Error inserting review details" });
      }
      // console.log("Customer details inserted successfully:", result);
      return res.status(200).json({
        status: "success",
        type: "Review",
        message: "Review added Successfully",
      });
    }
  );
};
