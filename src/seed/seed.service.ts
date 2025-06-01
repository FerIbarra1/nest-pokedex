import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {


  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) { }

  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const resp = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    const pokemonToInsert: { name: string, no: number }[] = [];

    resp.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no = +segments[segments.length - 2];

      pokemonToInsert.push({ name, no });
    })

    await this.pokemonModel.insertMany(pokemonToInsert);

    return `Seed executed successfully!`;
  }

}
