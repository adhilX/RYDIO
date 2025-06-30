import { RefreshTokenController } from "../../adapters/controllers/auth/RefreshTokenController";
import { TokenTimeExpiryValidationMiddleware } from "../../adapters/middlewares/tokenTimeExpiryValidationMiddleware";
import { verifyTokenAndCheckBlackList } from "../../adapters/middlewares/TokenVerifyMiddleware";
import { UserBlockCheckingMiddleware } from "../../adapters/middlewares/user/userBlockCheckingMiddleware";
import { AdminRepository } from "../../adapters/repository/admin/adminRepository";
import { UserRepostory } from "../../adapters/repository/user/userRepository";
import { RefreshTokenUseCase } from "../../useCases/auth/RefreshTokenUsecase";
import { JwtService } from "../services/jwtService";
import { RedisService } from "../services/redisService";
import { TokenService } from "../services/tokenService";

const redisService =new  RedisService()
const userRepository =new UserRepostory()
const jwtService = new JwtService()
const adminRepository = new AdminRepository()
const accessSecretKey = process.env.ACCESSTOKEN_SECRET_KEY as string 
const tokenService = new TokenService(redisService,jwtService,accessSecretKey)
//-----------user-block-checker
export const injectedUserBlockChecker = UserBlockCheckingMiddleware(redisService,userRepository)


//-=----------verify-token-----------
export const injectedVerfyToken = verifyTokenAndCheckBlackList(tokenService)

//-----------refresh token controller-----------

const refreshTokenUseCase = new RefreshTokenUseCase(jwtService,userRepository,adminRepository)
export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase)

export const tokenTimeExpiryValidationMiddleware = TokenTimeExpiryValidationMiddleware(jwtService)