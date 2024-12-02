import { z } from "zod";
const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
const registerSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Invalid Username" })
        .trim(),
    password: z
        .string()
        .min(1, { message: "Invalid Password" })
        .trim(),
    phoneNumber: z.string().regex(phoneRegex, 'Invalid Mobile Number'),
    email: z.string().email({ message: "Invalid email address" }).trim(),

    firstname: z
        .string()
        .min(1, { message: "Invalid First Name" })
        .trim(),

    lastname: z
        .string()
        .min(1, { message: "Invalid Last Name" })
        .trim(),
    agentReferralCode: z.string().optional(),
    re_password: z.string(),
    birthdate: z.string(),
    // region: z.string(),
    // province: z.string(),
    // city: z.string(),
    // barangay: z.string(),

}).refine((data) => (data.password === data.re_password)
    && (data.password != "" && data.re_password != ""), {
    message: "Passwords don't match",
    path: ["re_password"], // path of error
});



const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, { message: "Invalid Password" })
        .trim(),

    password: z
        .string()
        .min(1, { message: "Invalid Password" })
        .trim(),

    newPassword: z.string(),

}).refine((data) => (data.password === data.newPassword)
    && (data.password != "" && data.re_password != ""), {
    message: "Passwords don't match",
    path: ["newPassword"], // path of error
});

const loginSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Invalid Username" })
        .trim(),
    password: z
        .string()
        .min(1, { message: "Invalid Password" })
        .trim(),
});

const forgotPasswordSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Invalid Username" })
        .trim()
});

export {
    changePasswordSchema,
    registerSchema,
    phoneRegex,
    loginSchema,
    forgotPasswordSchema
}