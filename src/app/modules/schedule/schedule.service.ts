import { Prisma, Schedule } from '@prisma/client';
import { addHours, addMinutes, format } from 'date-fns';
import { IPaginationOptions } from '../../interfaces/pagination';
import { IFilterRequest, ISchedule } from './schedule.interface';
import prisma from '../../shared/prisma';
import { IJWTPayload } from '../../types/common';
import { paginationHelper } from '../../helper/paginationHelper';

const convertDateTime = async (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + offset);
}

const insertIntoDB = async (payload: ISchedule): Promise<Schedule[]> => {
    const { startDate, endDate, startTime, endTime } = payload;

    // Validate date order
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
        throw new Error('End date must be after or equal to start date');
    }

    // Validate time order
    const startTimeHour = Number(startTime.split(':')[0]);
    const startTimeMinute = Number(startTime.split(':')[1]);
    const endTimeHour = Number(endTime.split(':')[0]);
    const endTimeMinute = Number(endTime.split(':')[1]);
    
    if (startTimeHour > endTimeHour || 
        (startTimeHour === endTimeHour && startTimeMinute >= endTimeMinute)) {
        throw new Error('End time must be after start time');
    }

    const intervalTime = 30;
    const schedules = [];

    const currentDate = new Date(startDate); // start date
    const lastDate = new Date(endDate); // end date

    while (currentDate <= lastDate) {
        // Parse start time
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    startTimeHour
                ),
                startTimeMinute
            )
        );

        // Parse end time
        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    endTimeHour
                ),
                endTimeMinute
            )
        );

        // Generate intervals
        const tempStartDateTime = new Date(startDateTime); // Create a copy to avoid modifying the original
        
        while (tempStartDateTime < endDateTime) {
            const s = await convertDateTime(tempStartDateTime);
            const e = await convertDateTime(addMinutes(new Date(tempStartDateTime), intervalTime));

            const scheduleData = {
                startDateTime: s,
                endDateTime: e
            };

            // Check if schedule already exists
            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            });

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result);
            }

            tempStartDateTime.setMinutes(tempStartDateTime.getMinutes() + intervalTime);
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedules;
};

const getAllFromDB = async (
    filters: IFilterRequest,
    options: IPaginationOptions,
    user: IJWTPayload
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;

    const andConditions = [];

    if (startDate && endDate) {
        // Both dates provided - find schedules within the date range
        const startOfDay = new Date(startDate as string);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(endDate as string);
        endOfDay.setUTCHours(23, 59, 59, 999);

        andConditions.push({
            startDateTime: {
                gte: startOfDay,
                lte: endOfDay
            }
        });
    } else if (startDate) {
        // Only start date - find schedules on that specific day
        const startOfDay = new Date(startDate as string);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(startDate as string);
        endOfDay.setUTCHours(23, 59, 59, 999);

        andConditions.push({
            startDateTime: {
                gte: startOfDay,
                lte: endOfDay
            }
        });
    } else if (endDate) {
        // Only end date - find schedules on that specific day
        const startOfDay = new Date(endDate as string);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(endDate as string);
        endOfDay.setUTCHours(23, 59, 59, 999);

        andConditions.push({
            startDateTime: {
                gte: startOfDay,
                lte: endOfDay
            }
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }

    const whereConditions: Prisma.ScheduleWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user?.email
            }
        }
    });

    const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId);

    const result = await prisma.schedule.findMany({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                }
    });

    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const getByIdFromDB = async (id: string): Promise<Schedule | null> => {
    const result = await prisma.schedule.findUnique({
        where: {
            id,
        },
    });

    return result;
};

const deleteFromDB = async (id: string): Promise<Schedule> => {
    const result = await prisma.schedule.delete({
        where: {
            id,
        },
    });
    return result;
};


export const ScheduleService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB
}
