import { nanoid } from 'nanoid';
import { IIdGeneratorService } from '../../domain/interface/serviceInterface/IIdGeneratorServce';

export class IdGeneratorService  implements IIdGeneratorService{
   async generateBookingId(): Promise<string> {
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, ''); 
    const id = nanoid(6).toUpperCase(); 
    return `BK${date}${id}`;
  }

}