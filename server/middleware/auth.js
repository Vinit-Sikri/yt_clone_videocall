import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(`Token: ${token}`);

    if (!token) {
      return res.status(400).json("No token provided");
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Decoded Data: ${JSON.stringify(decodeData)}`);

    req.userId = decodeData?.id;
    next();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(400).json("Invalid Credentials");
  }
};

export default auth;
