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
exports.deleteProfile = exports.updateProfile = exports.getProfileById = exports.getProfiles = exports.createProfile = void 0;
const mssql_1 = __importDefault(require("mssql"));
const uuid_1 = require("uuid");
const specialist_det_validator_1 = require("../validators/specialist-det.validator");
const sqlConfig_1 = require("../config/sqlConfig");
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { photo, role, experience, education, languages, location, skills, description, hourlyRate } = req.body;
        console.log(req.body);
        const specialist_id = req.params.id;
        let { error } = specialist_det_validator_1.profileSchema.validate(req.body);
        if (error) {
            return res.json({
                error: error.details[0].message
            });
        }
        else {
            const id = (0, uuid_1.v4)();
            const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
            const newProfile = (yield pool.request()
                .input("profile_id", mssql_1.default.VarChar, id)
                .input("specialist_id", mssql_1.default.VarChar, specialist_id)
                .input("photo", mssql_1.default.VarChar, photo)
                .input("role", mssql_1.default.VarChar, role)
                .input("experience", mssql_1.default.VarChar, experience)
                .input("location", mssql_1.default.VarChar, location)
                .input("education", mssql_1.default.VarChar, education)
                .input("languages", mssql_1.default.VarChar, languages)
                .input("skills", mssql_1.default.VarChar, skills)
                .input("hourlyRate", mssql_1.default.VarChar, hourlyRate)
                .input("description", mssql_1.default.VarChar, description)
                .execute('createProfile')).rowsAffected;
            console.log(newProfile);
            if (newProfile) {
                return res.json({
                    message: "New profile created successfully",
                });
            }
            else {
                return res.json({ error: "An error occurred while creating profile." });
            }
        }
    }
    //catch block
    catch (error) {
        console.error("Error creating profile:", error);
        return res.json({ error: " The profile was not created." });
    }
});
exports.createProfile = createProfile;
// Get all Profiles
const getProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const query = `
            SELECT
                p.profile_id,
                p.specialist_id,
                p.photo,
                p.role,
                p.experience,
                p.education,
                p.location,
                p.languages,
                p.skills,
                p.description,
                p.hourlyRate,
                s.firstName,
                s.email,
                s.phone
            FROM
                Profiles p
            INNER JOIN
                Specialist s ON p.specialist_id = s.specialist_id
            WHERE
                p.isDeleted = 0;`;
        const allProfiles = yield pool.request().query(query);
        return res.json({ message: allProfiles.recordset });
    }
    catch (error) {
        console.error("Error fetching profiles:", error);
        return res.status(500).json({ error: "An error occurred while fetching profiles." });
    }
});
exports.getProfiles = getProfiles;
// Get Profile by ID
const getProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile_id = req.params.profile_id;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const profile = (yield pool.request().input("profile_id", mssql_1.default.VarChar, profile_id).execute('getProfileById')).recordset;
        return res.json({
            message: profile
        });
    }
    catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ error: "An error occurred while fetching profile." });
    }
});
exports.getProfileById = getProfileById;
// Update Profile
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile_id = req.params.profile_id;
        const { photo, role, experience, education, languages, location, skills, description, hourlyRate } = req.body;
        // Validate profile data
        const { error } = specialist_det_validator_1.profileSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        yield pool.request()
            .input("profile_id", mssql_1.default.VarChar, profile_id)
            // .input("specialist_id", mssql.VarChar, specialist_id)
            .input("photo", mssql_1.default.VarChar, photo)
            .input("role", mssql_1.default.VarChar, role)
            .input("experience", mssql_1.default.VarChar, experience)
            .input("location", mssql_1.default.VarChar, location)
            .input("education", mssql_1.default.VarChar, education)
            .input("languages", mssql_1.default.VarChar, languages)
            .input("skills", mssql_1.default.VarChar, skills)
            .input("hourlyRate", mssql_1.default.VarChar, hourlyRate)
            .input("description", mssql_1.default.VarChar, description)
            .execute('updateProfile');
        return res.json({ message: "Profile updated successfully" });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ error: "An error occurred while updating profile." });
    }
});
exports.updateProfile = updateProfile;
// Delete Profile
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile_id = req.params.profile_id;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        yield pool.request().input("profile_id", mssql_1.default.VarChar, profile_id).execute('deleteProfile');
        return res.json({ message: "Profile deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting profile:", error);
        return res.status(500).json({ error: "An error occurred while deleting profile." });
    }
});
exports.deleteProfile = deleteProfile;
