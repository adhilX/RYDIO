
export interface IredisService{
    connect():Promise<void>
    disconnect():Promise<void>
    get(key:string):Promise<string | null>
    set(key:string,seconds:number,value:string):Promise<void>
    del(key:string):Promise<void>
    setPermenant(key:string,value:string):Promise<void>
}