const insertIntoDB = async (payload: any) => {
    console.log({ payload });
    return payload;
}


export const ScheduleService = {
    insertIntoDB,
}