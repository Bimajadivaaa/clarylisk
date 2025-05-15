import { validate } from "../validation/validation.js";
import { regisValidation } from "../validation/userValidation.js";
import { loginValidation } from "../validation/userValidation.js";
import { PrismaClient } from "@prisma/client";
import responseError from "../error/responseError.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const register = async (req) => {
  const user = validate(regisValidation, req);

  const countUser = await prisma.user.count({
    where: {
      username: user.username,
    },
  });

  if (countUser === 1) {
    throw new responseError(400, "username already exist");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const insertUser = await prisma.user.create({
    data: {
      username: user.username,
      password: user.password,
      description: user.description,
      role: user.role,
    },
  });

  await prisma.photo.create({
    data: {
      image: user.image,
      idUser: insertUser.idUser,
    },
  });

  await prisma.wallet.create({
    data: {
      idUser: insertUser.idUser,
      walletAdress: user.walletAddress,
    },
  });

  await prisma.mediaSocial.create({
    data: {
      idUser: insertUser.idUser,
      facebook: user?.facebook,
      twitter: user?.twitter,
      instagram: user?.instagram,
      youtube: user?.youtube,
    },
  });

  const walletData = await prisma.wallet.findUnique({
    where: {
      idUser: insertUser.idUser,
    },
    select: {
      walletAdress: true,
    },
  });

  const response = walletData?.walletAdress || null;
  return response;
};

const generateToken = (username) => {
  return jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: "3600s", //1 hour
  });
};
export const login = async (req) => {
  console.log("req body login:", req);
  const user = validate(loginValidation, req);

  const response = await prisma.user.findFirst({
    where: {
      wallet: { some: { walletAdress: user.walletAddress } },
    },
    select: {
      idUser: true,
      username: true,
      password: true,
    },
  });

  if (response && (await bcrypt.compare(user.password, response.password))) {
    const token = generateToken(response.username);
    return {
      token: token,
    };
  } else {
    throw new responseError(400, "login failed");
  }
};

export const tesMiddleware = async (req) => {
  if (req != null) {
    return {
      message: "success",
    };
  } else {
    return {
      message: "null auth",
    };
  }
};

export const getProfile = async (req) => {
  const userSession = req.user;
  // console.log("user profile req:", userSession)

  const getData = await prisma.user.findFirst({
    where: {
      username: userSession.username,
    },
    select: {
      idUser: true,
      username: true,
      role: true,
      description: true,
      wallet: {
        select: {
          walletAdress: true,
        },
      },
      medsos: {
        select: {
          facebook: true,
          twitter: true,
          instagram: true,
          youtube: true,
        },
      },
      image: {
        select: {
          image: true,
        },
      },
    },
  });

  if (!getData) {
    return null;
  }

  return getData;
};

// create function to get all user, include wallet, medsos, and image
export const getCreators = async () => {
  const getData = await prisma.user.findMany({
    where: {
      role: "creator",
    },
    select: {
      idUser: true,
      username: true,
      role: true,
      description: true,
      wallet: {
        select: {
          walletAdress: true,
        },
      },
      medsos: {
        select: {
          facebook: true,
          twitter: true,
          instagram: true,
          youtube: true,
        },
      },
      image: {
        select: {
          image: true,
        },
      },
    },
  });

  if (!getData) {
    return null;
  }

  return {
    total: getData.length,
    data: getData,
  };
};

// create function to get user by id, include wallet, medsos, and image
export const getCreatorProfile = async (id) => {
  const getData = await prisma.user.findFirst({
    where: {
      idUser: Number(id),
      role: "creator",
    },
    select: {
      idUser: true,
      username: true,
      role: true,
      description: true,
      wallet: {
        select: {
          walletAdress: true,
        },
      },
      medsos: {
        select: {
          facebook: true,
          twitter: true,
          instagram: true,
          youtube: true,
        },
      },
      image: {
        select: {
          image: true,
        },
      },
    },
  });

  if (!getData) {
    return null;
  }
  return getData;
};

// create function to update user profile, include wallet, medsos, and image
export const updateProfile = async (userSession, data) => {
  const userExist = await prisma.user.findFirst({
    where: {
      username: userSession.username,
    },
  });

  if (!userExist) {
    throw new responseError(404, "user not found");
  }

  // check if password is not null, then hash the password
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  if (data.walletAddress) {
    await prisma.wallet.update({
      where: {
        idUser: userExist.idUser,
      },
      data: {
        walletAdress: data.walletAddress,
      },
    });
  }

  if (data.facebook) {
    await prisma.mediaSocial.update({
      where: {
        idUser: userExist.idUser,
      },
      data: {
        facebook: data.facebook,
      },
    });
  }

  if (data.twitter) {
    await prisma.mediaSocial.update({
      where: {
        idUser: userExist.idUser,
      },
      data: {
        twitter: data.twitter,
      },
    });
  }

  if (data.instagram) {
    await prisma.mediaSocial.update({
      where: {
        idUser: userExist.idUser,
      },
      data: {
        instagram: data.instagram,
      },
    });
  }

  if (data.youtube) {
    await prisma.mediaSocial.update({
      where: {
        idUser: userExist.idUser,
      },
      data: {
        youtube: data.youtube,
      },
    });
  }

  if (data.image) {
    await prisma.photo.update({
      where: {
        idUser: userExist.idUser,
      },
      data: {
        image: data.image,
      },
    });
  }

  data.description = data.description || userExist.description;
  data.role = data.role || userExist.role;

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const result = await prisma.user.update({
    where: {
      idUser: userExist.idUser, // Use idUser field with idUser value
    },
    data: {
      description: data.description,
      password: data.password,
      role: data.role,
    },
    select: {
      idUser: true,
      username: true,
      role: true,
      description: true,
      wallet: {
        select: {
          walletAdress: true,
        },
      },
      medsos: {
        select: {
          facebook: true,
          twitter: true,
          instagram: true,
          youtube: true,
        },
      },
      image: {
        select: {
          image: true,
        },
      },
    },
  });

  return result;
};

export const destroySession = async (req, res) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return {
      message: "no access token",
      success: false,
    };
  }

  res.clearCookie("access_token");
  return {
    message: "success logout",
    success: true,
  };
};

export const cekDataRequest = async (req) => {
  // ambil data dari cookie
  const cookie = req.cookies;
  const sessionUser = req.user;
  const authorization = req.headers.authorization;

  return {
    cookie,
    sessionUser,
    authorization,
  };
};
