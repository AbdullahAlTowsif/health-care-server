import { addMinutes, addHours, format } from "date-fns";
import { prisma } from "../../shared/prisma";

const insertIntoDB = async (payload: any) => {
    const { startTime, endTime, startDate, endDate } = payload;
    // console.log({startDate, endDate, startTime, endTime});
    const intervalTime = 30;

    const schedules = []

    const currentDate = new Date(startDate)
    const lastDate = new Date(endDate)

    while (currentDate <= lastDate) {
        // ekta diner shurur shomoy
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0])
                ), Number(startTime.split(":")[1])
            )
        )

        // ekta diner shesh shomoy
        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0])
                ), Number(endTime.split(":")[1])
            )
        )
        // console.log({startDateTime, endDateTime});

        // ekhon diner shuru and shesh shomoy k 30 min interval e bhag kore feltesi
        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime // 10:00
            const slotEndDateTime = addMinutes(startDateTime, intervalTime); // 10:30

            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime
            }
            // console.log("scheduleData", scheduleData);

            const existingSchedule = await prisma.schedule.findFirst({
                where: scheduleData
            })

            if(!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result)
            }
            slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime);
        }

        currentDate.setDate(currentDate.getDate() + 1)
    }
    return schedules;
}


export const ScheduleService = {
    insertIntoDB,
}