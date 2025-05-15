import responseError from "../error/responseError.js";
import {
  getCreators,
  register,
  updateProfile,
  cekDataRequest,
  destroySession,
} from "../service/userService.js";
import { login } from "../service/userService.js";
import { tesMiddleware } from "../service/userService.js";
import { getProfile, getCreatorProfile } from "../service/userService.js";
import "dotenv/config";

export const registerUser = async (req, res, next) => {
  try {
    const result = await register(req.body);
    res.status(200).json({
      message: "success registered",
      walletAdress: result,
    });
  } catch (err) {
    console.error("Error register:", err);
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const result = await login(req.body);
    if (!result.token) {
      throw new responseError(404, "token not found");
    }

    //ini buat pas tes local
    res.cookie("access_token", result.token, {
      httpOnly: false,
      secure: false, // http
      sameSite: process.env.SAMESITE,
      // domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
      maxAge: 8 * 60 * 60 * 1000, // 8 jam
    });

    //ini pas dah deploy
    res.cookie("access_token", result.token, {
      httpOnly: process.env.httpOnly,
      secure: process.env.NODE_ENV === "PROD", // Gunakan HTTPS hanya di produksi
      sameSite: process.env.SAMESITE,
      domain: process.env.NODE_ENV === "PROD" ? process.env.DOMAIN : undefined,
      maxAge: 8 * 60 * 60 * 1000, // 8 jam
    });

    console.log("Set-Cookie Header:", res.getHeaders()["set-cookie"]);
    console.log("token:", result.token);

    // res.status(200).redirect(process.env.COOKIE_URI);
    res.status(200).json({ token: result.token });
  } catch (err) {
    console.error("Error login:", err);
    next(err);
  }
};

export const validateMidTest = async (req, res) => {
  console.log("user controller:", req.user);
  const result = await tesMiddleware(req.user);
  res.status(200).json({ result: result });
};

export const profile = async (req, res, next) => {
  try {
    const result = await getProfile(req);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error get profile:", err);
    next(err);
  }
};

export const creatorList = async (req, res, next) => {
  try {
    const result = await getCreators();
    res.status(200).json(result);
  } catch (err) {
    console.error("Error get creator list:", err);
    next(err);
  }
};

export const getCreatorById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log("user id req:", userId)
    const result = await getCreatorProfile(userId);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error get user by id:", err);
    next(err);
  }
};

export const editProfile = async (req, res, next) => {
  try {
    const request = req.body;
    const userSession = req.user;

    const result = await updateProfile(userSession, request);
    const { password, ...rest } = result;
    res.status(200).json({
      message: "success update profile",
      data: rest,
    });
  } catch (err) {
    console.error("Error update profile:", err);
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const result = await destroySession(req, res);

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error logout:", err);
    next(err);
  }
};

export const cekData = async (req, res, next) => {
  try {
    const result = await cekDataRequest(req);
    res.status(200).json({
      data: result,
    });
  } catch (err) {
    console.error("Error update profile:", err);
  }
};
