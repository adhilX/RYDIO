export interface IBaseRepository<T> {
    create(data: T): Promise<T>
    delete(id: string): Promise<T | null>
    findById(id: string): Promise<T | null>
    findByEmail(email: string): Promise<T | null>
    
}