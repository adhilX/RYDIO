import { NextFunction, Request, Response } from "express";
import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository";
import { IredisService } from "../../../domain/interface/serviceInterface/IredisService";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export const UserBlockCheckingMiddleware = (redisService: IredisService,userRepository: IuserRepository) => {
  return async (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;
      // console.log(user)
      let isBlocked = await redisService.get(`user:${user.role}:${user.userId}`);
      if (!isBlocked) {
        isBlocked = await userRepository.findStatusForMidddlewere(user.userId);
        await redisService.set(`user:${user._id}:${user.role}`,300,String(isBlocked));
      }
      if (isBlocked === 'true') {
         res.status(HttpStatus.BAD_REQUEST).json({ message: "User is blocked.", });
         return
      }
      next();
  };
};
