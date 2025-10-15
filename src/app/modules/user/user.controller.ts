import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import { userFilterableFields } from "./user.constant";

const createPatient = catchAsync(async(req: Request, res: Response) => {
    const result = await UserService.createPatient(req);
    console.log(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Patient created successfully",
        data: result
    })
})

const getAllFromDB = catchAsync(async(req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields)
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
    // const {page, limit, searchTerm, sortBy, sortOrder, role, status} = req.query;
    // const result = await UserService.getAllFromDB({page: Number(page), limit: Number(limit), searchTerm, sortBy, sortOrder, role, status});
    const result = await UserService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

export const UserController = {
    createPatient,
    getAllFromDB,
}