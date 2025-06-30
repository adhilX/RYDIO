import { verifyTokenAndCheckBlackList } from "../../adapters/middlewares/TokenVerifyMiddleware";
import { UserBlockCheckingMiddleware } from "../../adapters/middlewares/user/userBlockChecking";
import { UserRepostory } from "../../adapters/repository/user/userRepository";
import { JwtService } from "../services/jwtService";
import { RedisService } from "../services/redisService";
import { TokenService } from "../services/tokenService";

const redisService =new  RedisService()
const userRepository =new UserRepostory()
const jwtService = new JwtService()
const accessSecretKey = process.env.ACCESSTOKEN_SECRET_KEY as string 
const tokenService = new TokenService(redisService,jwtService,accessSecretKey)
//-----------user-block-checker
export const injectedUserBlockChecker = UserBlockCheckingMiddleware(redisService,userRepository)


//-=----------verify-token-----------
export const injectedVerfyToken = verifyTokenAndCheckBlackList(tokenService)