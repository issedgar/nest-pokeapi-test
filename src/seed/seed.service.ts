import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PokeResponse } from './interfaces/poke-response-interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { FetchAdapter } from '../common/adapters/fetch.adapter';

@Injectable()
export class SeedService {    
    constructor(
        @InjectModel( Pokemon.name )
        private readonly pokemonModel: Model<Pokemon>,

        private readonly http: AxiosAdapter,

        private readonly http2: FetchAdapter
    ) {}

    async executeSeed() {

        await this.pokemonModel.deleteMany({});

        const data = await this.http2.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=500');
        const pokemonToInsert: { name: string, no: number }[] = [];

        data.results.forEach(({name, url}) => {
            const segments = url.split('/');
            const no = +segments[segments.length - 2];
            pokemonToInsert.push( {name, no} );
        });

        await this.pokemonModel.insertMany(pokemonToInsert);
        
        return 'Semilla implantada Promise';
    }
    
    async executeSeedPromise() {
        await this.pokemonModel.deleteMany({});
        const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=5');
        const insertPromisesArray = [];
        data.results.forEach(({name, url}) => {
            const segments = url.split('/');
            const no = +segments[segments.length - 2];
            insertPromisesArray.push( this.pokemonModel.create({name, no}) );
        });
        await Promise.all(insertPromisesArray);        
        return 'Semilla implantada Promise';
    }

    async executeSeedAwait() {
        await this.pokemonModel.deleteMany({});
        const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=5');
        data.results.forEach( async ({name, url}) => {
            const segments = url.split('/');
            const no = +segments[segments.length - 2];            
            await this.pokemonModel.create({name, no})
        });        
        return 'Semilla implantada Async';
    }
}
