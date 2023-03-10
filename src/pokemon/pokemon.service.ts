import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class PokemonService {

    constructor(
        @InjectModel( Pokemon.name )
        private readonly pokemonModel: Model<Pokemon>
    ){}


    async create(createPokemonDto: CreatePokemonDto) {
        createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
        try {
            const pokemon = await this.pokemonModel.create( createPokemonDto );
            return pokemon;
            
        } catch (error) {
            this.handleExceptions( error );
        }
    }

    findAll() {
        return `This action returns all pokemon`;
    }

    async findOne(id: string) {
        let pokemon: Pokemon;
        if( !isNaN(+id) ) {
            // Indica que es un numero, porque no es un Nan
            pokemon = await this.pokemonModel.findOne({ no: id });
        }
        if( !pokemon && isValidObjectId( id ) ) {
            pokemon = await this.pokemonModel.findById( id );
        }
        if( !pokemon) {
            pokemon = await this.pokemonModel.findOne({ name: id.toLocaleLowerCase().trim() });
        }

        if( !pokemon ) throw new NotFoundException(`Pokemon con id, nombre o número: ${ id }, no se encontró`)
        return pokemon;
    }

    async update(id: string, updatePokemonDto: UpdatePokemonDto) {

        let pokemon = await this.findOne( id );
        if(updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase().trim();

        try {
            await pokemon.updateOne( updatePokemonDto );
            return { ... pokemon.toJSON(), ... updatePokemonDto };            
        } catch (error) {
            this.handleExceptions( error );
        }
    }

    async remove(id: string) {
        // let pokemon = await this.findOne( id );
        // await pokemon.deleteOne();
        // return await this.pokemonModel.findByIdAndDelete(id);
        const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });        
        if(deletedCount === 0) throw new BadRequestException(`Pokemon con ${ id } no existe`);

        return;
    }

    private handleExceptions( error: any ) {
        if( error.code === 11000 ) {
            throw new BadRequestException(`Pokemon ya existe en la base de datos: ${ JSON.stringify( error.keyValue ) }`);                
        }
        throw new InternalServerErrorException('Error en servidor - solicitar validar logs');            
    }
}
