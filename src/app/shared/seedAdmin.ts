import bcryptjs from "bcryptjs";
import prisma from "./prisma";
import config from "../../config";
import { UserRole } from "@prisma/client";

export const seedAdmin = async () => {
    try {
        // Check if admin already exists in Admin table
        const isAdminExist = await prisma.admin.findFirst({
            where: {
                email: "admin@gmail.com"
            }
        });

        if (isAdminExist) {
            console.log("Admin Already Exists!");
            return;
        }

        console.log("Trying to create admin...");

        const hashedPassword = await bcryptjs.hash("123456", Number(config.salt_round));

        // First, create the Person record
        const admin = await prisma.user.create({
            data: {
                email: "admin@gmail.com",
                password: hashedPassword,
                role: UserRole.ADMIN,
                // Create the admin record in the same transaction
                admin: {
                    create: {
                        name: "Admin",
                        contactNumber: "01641413635"
                    }
                }
            },
            include: {
                admin: true
            }
        });

        console.log("Admin created Successfully! \n");
        console.log(admin);

    } catch (error) {
        console.log("Error creating admin:", error);
    }
};
