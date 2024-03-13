import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import mssql from 'mssql'
import jwt from 'jsonwebtoken'
import { ExtendeUser } from "../middlewares/verifyToken";
import Connection from "../dbHelper/dbhelper";
import { sqlConfig } from "../config/sqlConfig";
// import dotenv from 'dotenv'

const dbHelpers = new Connection

let SECRET = "QRTWVNSASMJWIO"

export const registerUserController = async (req: Request, res: Response) => {

  try {
    const { Name, email, password } = req.body;

if (!Name || !email || !password) {
  return res.json({ error: "Empty input fields" });

}  else if (!/^[a-zA-Z\s]*$/.test(Name)) {
  return res.json({error: "Invalid name entered"});

} else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
  return res.json({ error: "Invalid email format entered" });

} else if (password.length < 8) {
return res.json({ error: "Password is too short!"});
}
   const emailExists = await checkIfEmailExists(email);
    if (emailExists) {
      return res.json({
        error: 'Email is already registered',
      });
    }


    const userID = v4()
    const hashedpwd = await bcrypt.hash(password, 5);
    const pool = await mssql.connect(sqlConfig)

    const results = pool.request()
      .input('userID', mssql.VarChar, userID)
      .input('Name', mssql.VarChar, Name)
      .input('email', mssql.VarChar, email)
      .input('password', mssql.VarChar, hashedpwd)
      .execute('registerUser')

    return res.json({
      message: 'User registered successfully'
    })
  } catch (error) {
    return res.json({
      error: error,
      message: "Server error"
    })
  }

}

async function checkIfEmailExists(email: string): Promise<boolean> {
  const pool = await mssql.connect(sqlConfig);

  const result = await pool
    .request()
    .input('email', mssql.VarChar, email)
    .query('SELECT COUNT(*) AS count FROM Users WHERE email = @email');

  return result.recordset[0].count > 0;
}


export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body



    const pool = await mssql.connect(sqlConfig);
    const user = await (await pool.request().input('email', mssql.VarChar, email).input('password', mssql.VarChar, password).execute('loginUser')).recordset
    console.log(user);

    if (user[0]?.email == email) {
      const correctPWD = await bcrypt.compare(password, user[0]?.password);
      if(user.length < 1) {
        return res.status(202).json({
            error: "User not found"
        })
    }

    const isVerified = user[0].isVerified

    if(!isVerified){
        return res.status(202).json({
            error: "You need to verify your email to login"
        })
    }

      if (!correctPWD) {
        return res.json({
          error: "Incorrect Password"
        })
      }

      const loginCredentials = user.map((records) => {
        const { password, ...rest } = records;
        return rest
      });

      const token = jwt.sign(loginCredentials[0], process.env.SECRET || SECRET as string, {
        expiresIn: '36000h'
      })

      return res.json({
        message: 'User Logged in successfully',
        token,
        ...loginCredentials[0]
      })

    } else {
      return res.json({
        error: "Email not found"
      })
    }

  } catch (error) {
    return res.json({
      error: error
    })
  }
}

export const validateUser = async (req: Request, res: Response) => {
  try {
      const userID = req.params.userID;

      const pool = await mssql.connect(sqlConfig);

      const alreadyVerified = (await pool.request()
      .input('userID', mssql.VarChar, userID)
      .query('SELECT * FROM Users WHERE userID = @userID AND isVerified = 0')).recordset

      if(alreadyVerified.length < 1) {
          return res.json({
              error: "Email is already verified"
          })
      }

      const result = await pool.request()
      .input('userID', mssql.VarChar, userID)
      .query('UPDATE Users SET isVerified = 1 WHERE userID = @userID AND isVerified = 0');

      const rowsAffected = result.rowsAffected[0];

      if (rowsAffected > 0){
          return res.json({
              success: "Email successfully validated"
          })
      } else {
          return res.json({
              error: "There was an error trying to validate email"
          })
      }
  } catch (error) {
      return res.json({
          error
      })
  }
}




export const checkUserDetails = async(req: ExtendeUser, res: Response)=>{
  if(req.info){
      return res.json({
          info: req.info
      })
  }
}
export const generateOTP = async (req: Request, res: Response) => {
  const { email, subject, message, duration = 1 } = req.body;

  try {
      if (!(email && subject && message)) {
          return res.json({ error: "Provide values for email, subject, message" });
      }

      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

      // Assuming this function is responsible for sending OTP via email
      // Implement the logic to send OTP via email here
      
      // Clear any old record
      await deleteOTP(email);

      return res.json({ otp });
  } catch (error) {
      return res.json({ error: "Error when generating OTP" });
  }
}

export const deleteOTP = async (email: string) => {
  // Assuming this function is responsible for deleting OTP records
  // Implement the logic to delete OTP records for the given email
  console.log("Deleting OTP for email:", email);
}


export const fetchAllUSersController = async (req: Request, res: Response) => {
  try {

    const pool = await mssql.connect(sqlConfig);
    let users = (await pool.request().execute('getAllUsers')).recordset

    return res.json(users)

  } catch (error) {
    return res.json({
      error: error
    })
  }
}

export const getSingleUserController = async (req: Request, res: Response) => {
  try {
    const userID = req.params.userID;
    console.log(userID);
    if (!userID) return res.send({ message: "Id is required" });


    const result = await dbHelpers.execute('getSingleUser', { userID });

    res.json(result.recordset);

  } catch (error) {
    return res.json({
      error: error
    })
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params

    const deleteUser = await dbHelpers.execute('deleteUser', { userID })

    if (deleteUser.rowsAffected[0] == 0) {
      return res.json({
        message: 'User not found'
      })

    } else {
      return res.json({
        message: 'User deleted successfully'
      })
    }

  } catch (error) {
    return res.json({
      error: error
    })
  }
}

export const updateUserController = async (req: Request, res: Response) => {
  try {

    const { Name, email } = req.body
    const { userID } = req.params
    // const { error } = validateUpdateuser.validate(req.body);
    // if (error)
    //   return res.status(403).json({ success: false, message: error.details[0].message });

    const pool = await mssql.connect(sqlConfig)

    const updateUsers = await pool.request()
      .input('userID', mssql.VarChar, userID)
      .input('Name', mssql.VarChar, Name)
      .input('email', mssql.VarChar, email)
      .execute('updateUser')

    return res.json({
      message: "User updated successfully"
    });

  } catch (error) {
    return res.json({
      error: error
    })
  }
}


export const getUserDetails = async (req: ExtendeUser, res: Response) => {
  try {
    const user = req.info
    // console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found"
      })
    }

    const pool = await mssql.connect(sqlConfig);
    const userID = user.userID
    console.log(userID);

    const result = await dbHelpers.execute('GetUserDetails', { userID });

    const userDetails = result.recordset
    console.log(userDetails);
    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });

    }

    return res.status(200).json(userDetails);

  } catch (error) {
    return res.json({
      error: error
    })
  }
}

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    const test = req.body
    console.log(test);

    const hashedPwd = await bcrypt.hash(newPassword, 5);

    const result = (await dbHelpers.execute('resetPassword', {
      email,
      newPassword: hashedPwd,
    }));
    console.log('result here', result);

    if (result.returnValue < 1) {
      return res.json({
        message: 'User not found',
      });
    } else {
      return res.json({
        message: 'Password updated successfully',
      });
    }
  } catch (error) {
    return res.status(501).json({
      error: error,
    });
  }
};
