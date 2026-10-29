import * as z from "zod";

export const signupSchema = z.object({
       
    name: z.string()
            .trim()
            .min(3,"minimum name should be 3 letter long")
            .max(30,"minimum name should be 3 letter long"),
    age: z.number()
          .min(10,"minimum age should be 10")
          .max(100,"minimum age should be 100")
          .optional(),

    email: z.preprocess(
             (value) => typeof value === "string"
             ? value.trim().toLowerCase()
             : value,
             z.email("email should be valid")
            ),

    password: z.string()
                .min(8)
                .max(30)
               .regex(/[A-Z]/,"Your password should have one capital letter in it")
               .regex(/[a-z]/,"Your password should have one small letter in it")
               .regex(/[0-9]/,"Your password should have one Number in it")
               .regex(/[^a-zA-Z0-9]/, "Your password should have at least one special character")
});

export const loginSchema = z.object({
    email: z.preprocess(
        (value)=> typeof value == "string" ? value.trim().toLowerCase():"",
        z.email("Email must be valid")
    ),
    password: 
            z.string()
            .min(8)
            .max(30)
            .regex(/[A-Z]/,"Your password should have atleast one capital letter")
            .regex(/[a-z]/,"Your password should have atleast one small letter")
            .regex(/[0-9]/,"Your password should have atleast one number")
            .regex(/[~?@.,<>,{}:'!^#()&-+]/,"Your password should have atleast one special character")
});
