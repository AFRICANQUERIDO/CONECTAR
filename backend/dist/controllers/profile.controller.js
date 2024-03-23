"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfile = void 0;
const mssql_1 = __importDefault(require("mssql"));
const sqlConfig_1 = require("../config/sqlConfig");
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.params.id;
        const { role, profile_pic, phone_number, DOB, gender, education, experience, language, about, nickname, country, city, industry, sector } = req.body;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('userID', mssql_1.default.VarChar, userID)
            .input('role', mssql_1.default.VarChar, role)
            .input('profile_pic', mssql_1.default.VarChar, profile_pic)
            .input('phone_number', mssql_1.default.VarChar, phone_number)
            .input('DOB', mssql_1.default.VarChar, DOB)
            .input('gender', mssql_1.default.VarChar, gender)
            .input('education', mssql_1.default.VarChar, education)
            .input('experience', mssql_1.default.VarChar, experience)
            .input('language', mssql_1.default.VarChar, language)
            .input('about', mssql_1.default.VarChar, about)
            .input('nickname', mssql_1.default.VarChar, nickname)
            .input('country', mssql_1.default.VarChar, country)
            .input('city', mssql_1.default.VarChar, city)
            .input('industry', mssql_1.default.VarChar, industry)
            .input('sector', mssql_1.default.VarChar, sector)
            .execute('createProfile');
        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            return res.json({ message: 'User details updated successfully' });
        }
        else {
            return res.json({ error: 'Failed to update user details' });
        }
    }
    catch (error) {
        console.error('Error updating user details:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createProfile = createProfile;
// // Get all Profiles
// export const getProfiles = async (req: Request, res: Response) => {
//     try {
//         const pool = await mssql.connect(sqlConfig);
//         const query = `
//             SELECT
//                 p.profile_id,
//                 p.specialist_id,
//                 p.photo,
//                 p.role,
//                 p.experience,
//                 p.education,
//                 p.location,
//                 p.languages,
//                 p.skills,
//                 p.description,
//                 p.hourlyRate,
//                 s.firstName,
//                 s.email,
//                 s.phone
//             FROM
//                 Profiles p
//             INNER JOIN
//                 Specialist s ON p.specialist_id = s.specialist_id
//             WHERE
//                 p.isDeleted = 0;`;
//         const allProfiles = await pool.request().query(query);
//         return res.json({ message: allProfiles.recordset });
//     } catch (error) {
//         console.error("Error fetching profiles:", error);
//         return res.status(500).json({ error: "An error occurred while fetching profiles." });
//     }
// };
// // Get Profile by ID
// export const getProfileById = async (req: Request, res: Response) => {
//     try {
//         const profile_id = req.params.profile_id;
//         const pool = await mssql.connect(sqlConfig);
//         const profile = (await pool.request().input("profile_id", mssql.VarChar, profile_id).execute('getProfileById')).recordset;
//         return res.json({
//             message: profile
//         });
//     } catch (error) {
//         console.error("Error fetching profile:", error);
//         return res.status(500).json({ error: "An error occurred while fetching profile." });
//     }
// };
// // Update Profile
// export const updateProfile = async (req: Request, res: Response) => {
//     try {
//         const profile_id = req.params.profile_id;
//         const { photo, role, experience, education, languages, location, skills, description, hourlyRate }: ProfileInterface = req.body;
//         // Validate profile data
//         const { error } = clientSchema.validate(req.body);
//         if (error) {
//             return res.status(400).json({ error: error.details[0].message });
//         }
//         const pool = await mssql.connect(sqlConfig);
//         await pool.request()
//             .input("profile_id", mssql.VarChar, profile_id)
//             // .input("specialist_id", mssql.VarChar, specialist_id)
//             .input("photo", mssql.VarChar, photo)
//             .input("role", mssql.VarChar, role)
//             .input("experience", mssql.VarChar, experience)
//             .input("location", mssql.VarChar, location)
//             .input("education", mssql.VarChar, education)
//             .input("languages", mssql.VarChar, languages)
//             .input("skills", mssql.VarChar, skills)
//             .input("hourlyRate", mssql.VarChar, hourlyRate)
//             .input("description", mssql.VarChar, description)
//             .execute('updateProfile');
//         return res.json({ message: "Profile updated successfully" });
//     } catch (error) {
//         console.error("Error updating profile:", error);
//         return res.status(500).json({ error: "An error occurred while updating profile." });
//     }
// };
// Delete Profile
// export const deleteProfile = async (req: Request, res: Response) => {
//     try {
//         const profile_id = req.params.profile_id;
//         const pool = await mssql.connect(sqlConfig);
//         await pool.request().input("profile_id", mssql.VarChar, profile_id).execute('deleteProfile');
//         return res.json({ message: "Profile deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting profile:", error);
//         return res.status(500).json({ error: "An error occurred while deleting profile." });
//     }
// }
