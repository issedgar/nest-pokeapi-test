import { Injectable } from '@nestjs/common';
import { HttAdapter } from '../interfaces/http-adapter.interface';


@Injectable()
export class FetchAdapter implements HttAdapter {    

    async get<T>(url: string): Promise<T> {        
        try {

            const resp = await fetch( url );
            return await resp.json();
            
        } catch (error) {
            throw new Error('Ha ocurrido un error - solicitar logs');
            
        }
    }

}
