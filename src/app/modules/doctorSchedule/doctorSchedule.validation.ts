import z from "zod";

const createDoctorScheduleZodValidationSchema = z.object({
    body: z.object ({
        scheduleIds: z.array(z.string())
    })
})

export const DoctorScheduleValidation = {
    createDoctorScheduleZodValidationSchema
}