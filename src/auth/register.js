import { request, response } from "express";
import db from "../conn";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs"; // corrected spelling from "bycrypt" to "bcrypt"

const uploadsDir = path.join(__dirname, '../../uploads');

// Membuat folder uploads jika belum ada
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

async function register(req = request, res = response) {
  try {
    const { username, email, password, imageProfile } = req.body;

    const emailCase = email.toLowerCase();
    const hashPass = await bcrypt.hash(password, 10);
    const findUser = await db.user.findUnique({
      where: {
        email: emailCase,
      },
    });

    if (findUser) {
      return res.status(401).json({
        status: false,
        message: "Email sudah ada",
      });
    }

    // Mengambil MIME type dari imageProfile
    const mimeTypeMatch = imageProfile.match(/data:(image\/\w+);base64,/);
    if (!mimeTypeMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid image data",
      });
    }
    
    const mimeType = mimeTypeMatch[1];
    const extension = mimeType.split('/')[1]; // Mendapatkan ekstensi file dari MIME type

    // Menghapus prefix data URL (jika ada) sebelum mengkonversi base64 ke buffer
    const base64Data = imageProfile.replace(/^data:image\/\w+;base64,/, "");

    // Mengkonversi base64 ke buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Menentukan path untuk menyimpan gambar
    const imagePath = path.join(__dirname, '../../uploads', `${email}-profile.${extension}`); // Menggunakan ekstensi yang diperoleh

    // Menyimpan buffer sebagai file gambar
    fs.writeFileSync(imagePath, buffer);

    const result = await db.user.create({
      data: {
        username,
        email: emailCase,
        password: hashPass,
        imageProfile: imagePath,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export {
  register,
};
