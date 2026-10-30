import {redis} from "../../config/redis.config.js";
import { AppError } from "../middleware/error.middleware.js";
export const setCache=async(key, data, ttl=3600)=>{
    if(!key || !data){
        throw new AppError("data is required for seting cache",400);
    }
    const setcache = await redis.set(key,data,{ex:ttl});
    if(!setcache){
        throw new AppError("set cache cannot be done",500)
    }
    return setcache;
}

export const getCache = async(key)=>{
    if(!key){
        throw new AppError("key is required in getting cache")
    }
    const getcache = await redis.get(key)
    if(!getcache){
        throw new AppError("get cache failed try ");
    }
    return cache;
}