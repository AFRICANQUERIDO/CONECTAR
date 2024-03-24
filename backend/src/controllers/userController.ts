import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import mssql from 'mssql'
import { ExtendeUser } from "../middlewares/verifyToken";
import Connection from "../dbHelper/dbhelper";
import { sqlConfig } from "../config/sqlConfig";
// import dotenv from 'dotenv'

const dbHelpers = new Connection

export const setRole = (async (req: Request, res : Response) =>{
  try {
      const userID = req.params.id;

      const { role } = req.body;

      const pool = await mssql.connect(sqlConfig);

      const result = (await pool.request()
      .input('userID', mssql.VarChar, userID)
      .input('role', mssql.VarChar, role.trim().toLocaleLowerCase())
      .query('UPDATE UserDetails SET role = @role WHERE userId = @userId')).rowsAffected

      return res.status(200).json({
          success: "Role set successfully"
      })
      
  } catch (error) {
      return res.status(500).json({
          error
      })
  }
})

export const registerUserController = async (req: Request, res: Response) => {

  try {
    const { Name, email, password, role } = req.body;

    if (!Name || !email || !password) {
      return res.json({ error: "Empty input fields" });

    } else if (!/^[a-zA-Z\s]*$/.test(Name)) {
      return res.json({ error: "Invalid name entered" });

    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
      return res.json({ error: "Invalid email format entered" });
      
  } else if (password.length < 8) {
    return res.json({ error: "Password is too short!" });
} else if (!/[a-zA-Z]/.test(password)) {
    return res.json({ error: "Password must contain letters" });
} else if (!/\d/.test(password)) {
    return res.json({ error: "Password must contain numbers" });
} else if (!/[@$!%*?&]/.test(password)) {
    return res.json({ error: "Password must contain special characters" });
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

    const results = (await pool.request()
    .input('role', mssql.VarChar, role)
    .input('userID', mssql.VarChar, userID)
    .input('Name', mssql.VarChar, Name)
    .input('email', mssql.VarChar, email)
    .input('password', mssql.VarChar, hashedpwd)
    .execute('registerUser')).recordset;

      return res.json({
        message: 'User registered successfully',
        userID: userID
      });
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
    .query('SELECT COUNT(*) AS count FROM UserDetails WHERE email = @email');

  return result.recordset[0].count > 0;
}


export const fetchAllUSersController = async (req: Request, res: Response) => {
  try {

    const pool = await mssql.connect(sqlConfig);
    let users = (await pool.request().execute('getAllUsers')).recordset

    return res.json({users:users})

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
      return res.json({
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
      return res.json({ message: 'User details not found' });

    }

    return res.json(userDetails);

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
    return res.json({
      error: error,
    });
  }
};

// reset password more secure
// function generateResetToken() {
//   return crypto.randomUUID().toString()
// };

// export async function saveResetToken(email, token, expiresAt) {
//   const query = 'INSERT INTO ResetPasswordToken (email, Token_value, created_at, expired_at) VALUES (?, ?, ?, ?)';
//   const values = [email, token, new Date(), expiresAt];
  
//   try {
//       const result = await pool.query(query, values);
//       console.log('Reset token saved in database:', result);
//   } catch (error) {
//       console.error('Error saving reset token in database:', error);
//       throw error;
//   }
// }
//  export function calculateExpirationTime() {
//   const now = new Date();
//   return new Date(now.getTime() + 60 * 60 * 1000); // 1 hour expiry
// }
