import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';

import { PokemonService } from './pokemon.service';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    create(@Body() createPokemonDto: CreatePokemonDto) {
        return this.pokemonService.create(createPokemonDto);
    }

    @Get()
    findAll() {
        return this.pokemonService.findAll();
    }

    @Get('/page')
    findAllPage(@Query() paginationDto: PaginationDto ) {
        return this.pokemonService.findAllPage( paginationDto );
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pokemonService.findOne( id );
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
        return this.pokemonService.update( id, updatePokemonDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseMongoIdPipe) id: string) {
        return this.pokemonService.remove(id);
    }
}
