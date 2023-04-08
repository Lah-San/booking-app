//SWDlIxO3489mLeL6

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const UserModel = require("./models/Users");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const Place = require("./models/Place");
const { errorMonitor } = require("stream");
const Booking = require("./models/Booking");
const { rejects } = require("assert");
require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5173",
  })
);

const bcryptySalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWTKEY;
const aws_bucket = "lah-booking-app";

const mime = require("mime-types");

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: "ap-southeast-2",
    credentials: {
      accessKeyId: "AKIAXWOTMPNCF757ZNVH",
      secretAccessKey: "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",
    },
  });
  const parts = originalFilename.split(".");
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + "." + ext;

  await client.send(
    new PutObjectCommand({
      Bucket: aws_bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );
  return `https://${aws_bucket}.s3.amazonaws.com/${newFilename}`;
}

// get user token
// function getUserDataFromReq(req) {
//   return new Promise((resolve, rejec t) => {
//     jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
//       if (err) throw err;
//       resolve(userData);
//     });
//   });
// }

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
        if (err) {
          reject(err);
        } else {
          resolve(userData);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

app.post("/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, email, password } = req.body;

  try {
    if (
      (existingUser = await UserModel.findOne({ $or: [{ name }, { email }] }))
    ) {
      return res.status(400).json("already exists");
    }
    const newUser = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptySalt),
    });
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("Missing email or password");
    }
    const UserDoc = await UserModel.findOne({ email });
    if (!UserDoc) {
      return res.status(404).json("User not found");
    }
    const passOk = bcrypt.compareSync(password, UserDoc.password);
    if (!passOk) {
      return res.status(401).json("Invalid password");
    }
    jwt.sign(
      { email: UserDoc.email, id: UserDoc._id, name: UserDoc.name },
      jwtSecret,
      {},
      (err, token) => {
        if (err) {
          return res.status(500).json(err.message);
        }
        res.cookie("token", token).json(UserDoc);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

app.get("/profile", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if (!token) {
    return res.json(null);
  } else {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).json({ error: "Unauthorized" });
      }
      try {
        const { name, email, _id } = await UserModel.findById(userData.id);
        res.json({ name, email, _id });
      } catch (error) {
        console.error("Error while finding user:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
});

app.post("/logout", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  try {
    const { link } = req.body;
    const newName = "photo" + Date.now() + ".jpg";
    await imageDownloader.image({
      url: link,
      dest: "/tmp/" + newName,
    });
    const url = await uploadToS3(
      "/tmp/" + newName,
      newName,
      mime.lookup("/tmp/" + newName)
    );
    res.json(url);
  } catch (err) {
    console.error(err);
    res.status(415).json({ message: "File not supported" });
  }
});

const photosMiddleware = multer({ dest: "/tmp" });
app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname, mimetype } = req.files[i];
      const url = await uploadToS3(path, originalname, mimetype);
      uploadedFiles.push(url);
      // const parts = originalname.split(".");
      // const ext = parts[parts.length - 1];
      // const newPath = path + "." + ext;
      // fs.renameSync(path, newPath);
      // uploadedFiles.push(newPath.replace("uploads/", ""));
    }
    res.json(uploadedFiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
});

app.delete("/places/:id", async (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URL);

    const { token } = req.cookies;
    const { id } = req.params;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ message: "Unauthorized" });
      }
      const deletedPlace = await Place.findByIdAndDelete({
        _id: id,
        owner: userData.id,
      });
      if (!deletedPlace) {
        return res.status(404).json({ message: "Place not found" });
      }
      return res.json(deletedPlace);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const { token } = req.cookies;
    const {
      id, // the ID of the existing Place to update
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ message: "Unauthorized" });
      }
      const updatedPlace = await Place.findOneAndUpdate(
        { _id: id, owner: userData.id }, // find the existing Place by ID and owner
        {
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price,
        },
        { new: true } // return the updated document instead of the old one
      );
      if (!updatedPlace) {
        return res.status(404).json({ message: "Place not found" });
      }
      return res.json(updatedPlace);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const { token } = req.cookies;
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ message: "Unauthorized" });
      }
      const placeDoc = await Place.create({
        owner: userData.id,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      return res.json(placeDoc);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/search", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { title, maxGuests } = req.query;

  try {
    const data = await Place.find({
      $and: [
        { title: { $regex: new RegExp(title, "i") } },
        { maxGuests: { $gte: parseInt(maxGuests) } },
      ],
    });

    if (!data || data.length === 0) {
      return res.status(404).json("Not found");
    }

    res.json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// app.get("/user-places", async (req, res) => {
//   const { token } = req.cookies;
//   jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//     const { id } = userData;
//     res.json(await Place.find({ owner: id }));
//   });
// });

app.get("/user-places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { id } = userData;
      try {
        const places = await Place.find({ owner: id });
        res.json(places);
      } catch {
        res.status(404).json("Not Found");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/places/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const { id } = req.params;
    const placeDoc = await Place.findById(id);

    if (!placeDoc) {
      return res.status(404).json("Place not found");
    }

    res.json(placeDoc);
  } catch (error) {
    //console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/edit/places/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      try {
        const { id: user_id } = userData;
        const { id: place_id } = req.params;
        const place = await Place.findOne({ _id: place_id, owner: user_id });
        if (!place) {
          return res.status(404).json({ message: "Place not found" });
        }
        res.json(place);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    res.json(await Place.find());
  } catch {
    res.status(500).json("Internal Server Error");
  }
});

app.post("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userData = await getUserDataFromReq(req);
    const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
      req.body;

    const bookingDoc = await Booking.create({
      place,
      user: userData.id,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
    });

    res.json(bookingDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userData = await getUserDataFromReq(req);
    if (!userData) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const bookings = await Booking.find({ user: userData.id }).populate(
      "place"
    );

    if (bookings.length === 0) {
      return res.status(404).json({ error: "No bookings found" });
    }

    res.json(bookings);
  } catch (error) {
    //console.error(error);

    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/bookings/delete/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userData = await getUserDataFromReq(req);

    if (!userData) {
      throw new Error("Unauthorized");
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.user.toString() !== userData.id) {
      throw new Error("Unauthorized");
    }

    res.json(await Booking.findByIdAndDelete(req.params.id));
  } catch (error) {
    console.error(error);

    if (error.message === "Unauthorized") {
      mongoose
        .connect("mongodb://127.0.0.1:27017/mern-airbnc", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => console.log("Connected to DB"))
        .catch(console.error);
      res.status(401).json({ error: "Unauthorized" });
    } else if (error.message === "Booking not found") {
      res.status(404).json({ error: "Booking not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.listen(4000, () => console.log("Server started on port 4000"));
