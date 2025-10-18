import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.DOCTOR),
    validateRequest(DoctorScheduleValidation.createDoctorScheduleZodValidationSchema),
    DoctorScheduleController.insertIntoDB
)

export const doctorScheduleRoutes = router;