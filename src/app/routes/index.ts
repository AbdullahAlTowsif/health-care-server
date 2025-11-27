import express from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { ScheduleRoutes } from '../modules/schedule/schedule.routes';
import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.routes';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.routes';
import { DoctorRoutes } from '../modules/doctor/doctor.routes';
import { AppointmentRoutes } from '../modules/appointment/appointment.routes';
import { PrescriptionRoutes } from '../modules/prescription/prescription.routes';
import { ReviewRoutes } from '../modules/review/review.routes';
import { PatientRoutes } from '../modules/patient/patient.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { MetaRoutes } from '../modules/meta/meta.routes';
import { apiLimiter } from '../middlewares/rateLimiter';
import { AuthRoutes } from '../modules/auth/auth.routes';


const router = express.Router();
// router.use(apiLimiter);

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/schedule',
        route: ScheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes
    },
    {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
    {
        path: '/doctor',
        route: DoctorRoutes
    },
    {
        path: '/appointment',
        route: AppointmentRoutes
    },
    {
        path: '/prescription',
        route: PrescriptionRoutes
    },
    {
        path: '/review',
        route: ReviewRoutes
    },
    {
        path: '/patient',
        route: PatientRoutes
    },
    {
        path: '/metadata',
        route: MetaRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;