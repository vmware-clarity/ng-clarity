/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

interface PokemonTemplate {
  fileName: string;
  name: string;
  contentHtml: string;
}

const pokemonTemplates: PokemonTemplate[] = [
  {
    name: 'Charizard',
    fileName: 'pokemon/charizard.ts',
    contentHtml: `
    <p>
      Charizard flies around the sky in search of powerful opponents. It breathes fire of such great heat that it melts
      anything. However, it never turns its fiery breath on any opponent weaker than itself.
    </p>
    `,
  },
  {
    name: 'Charmander',
    fileName: 'pokemon/charmander.ts',
    contentHtml: `
    <p>
      The flame that burns at the tip of its tail is an indication of its emotions. The flame wavers when Charmander is
      enjoying itself. If the Pokémon becomes enraged, the flame burns fiercely.
    </p>
    `,
  },
  {
    name: 'Jigglypuff',
    fileName: 'pokemon/jigglypuff.ts',
    contentHtml: `
    <p>
      Jigglypuff's vocal cords can freely adjust the wavelength of its voice. This Pokémon uses this ability to sing at
      precisely the right wavelength to make its foes most drowsy.
    </p>
    `,
  },
  {
    name: 'Pidgey',
    fileName: 'pokemon/pidgey.ts',
    contentHtml: `
    <p>
      Pidgey has an extremely sharp sense of direction. It is capable of unerringly returning home to its nest, however
      far it may be removed from its familiar surroundings.
    </p>
    `,
  },
  {
    name: 'Pikachu',
    fileName: 'pokemon/pikachu.ts',
    contentHtml: `
    <p>
      Whenever Pikachu comes across something new, it blasts it with a jolt of electricity. If you come across a
      blackened berry, it's evidence that this Pokémon mistook the intensity of its charge.
    </p>
    `,
  },
  {
    name: 'Raichu',
    fileName: 'pokemon/raichu.ts',
    contentHtml: `
    <p>
      If the electrical sacs become excessively charged, Raichu plants its tail in the ground and discharges. Scorched
      patches of ground will be found near this Pokémon's nest.
    </p>
    `,
  },
  {
    name: 'Snorlax',
    fileName: 'pokemon/snorlax.ts',
    contentHtml: `
    <p>
      Snorlax's typical day consists of nothing more than eating and sleeping. It is such a docile Pokémon that there
      are children who use its expansive belly as a place to play.
    </p>
    `,
  },
];

export const pokemonComponents = pokemonTemplates.reduce<Record<string, string>>((additionalFiles, pokemonTemplate) => {
  additionalFiles[pokemonTemplate.fileName] = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrFocusOnViewInitModule } from '@clr/angular';

@Component({
  template: \`
    <div cds-text="subsection bold" clrFocusOnViewInit class="demo-title">${pokemonTemplate.name}</div>
    ${pokemonTemplate.contentHtml}
  \`,
  
  imports: [CommonModule, ClrFocusOnViewInitModule],
})
export class ${pokemonTemplate.name}Component {}
`;

  return additionalFiles;
}, {});

const pokemonTypeTemplates: PokemonTemplate[] = [
  {
    name: 'Electric',
    fileName: 'pokemon-types/electric.ts',
    contentHtml: `
    <p>
      There are relatively few Electric Pokémon; in fact only four were added in the third generation. Most are based on
      rodents or inanimate objects.
    </p>
    <p>Electric Pokémon are very good defensively, being weak only to Ground moves.</p>
    `,
  },
  {
    name: 'Fighting',
    fileName: 'pokemon-types/fighting.ts',
    contentHtml: `
    <p>
      Fighting Pokémon are strong and muscle-bound, often based on martial artists. Fighting moves are super-effective
      against five other types (as is Ground), making them very good offensively. Most Fighting type moves are in the
      Physical category, for obvious reasons.
    </p>
    `,
  },
  {
    name: 'Grass',
    fileName: 'pokemon-types/grass.ts',
    contentHtml: `
    <p>
      Grass is one of the three basic elemental types along with Fire and Water, which constitute the three starter
      Pokémon. This creates a simple triangle to explain the type concept easily to new players.
    </p>
    <p>
      Grass is one of the weakest types statistically, with 5 defensive weaknesses and 7 types that are resistant to
      Grass moves. Furthermore, many Grass Pokémon have Poison as their secondary type, adding a Psychic vulnerability.
      The type combination with the most weaknesses is Grass/Psychic.
    </p>
    `,
  },
  {
    name: 'Normal',
    fileName: 'pokemon-types/normal.ts',
    contentHtml: `
    <p>
      The Normal type is the most basic type of Pokémon. They are very common and appear from the very first route you
      visit. Most Normal Pokémon are single type, but there is a large contingent having a second type of Flying.
    </p>
    `,
  },
  {
    name: 'Poison',
    fileName: 'pokemon-types/poison.ts',
    contentHtml: `
    <p>
      The Poison type is regarded as one of the weakest offensively. Prior to Pokémon X/Y it was super-effective only
      against Grass (many of which are dual Poison so neutralizes the effect). It now has an extra advantage against the
      new Fairy type. In the first generation it was also super-effective against Bug but this was changed. It fares a
      little better defensively but its best advantage is through status moves like Toxic.
    </p>
    `,
  },
];

export const pokemonTypeComponents = pokemonTypeTemplates.reduce<Record<string, string>>(
  (additionalFiles, pokemonTypeTemplate) => {
    additionalFiles[pokemonTypeTemplate.fileName] = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  template: \`
    <div cds-text="subsection bold" clrFocusOnViewInit>${pokemonTypeTemplate.name}</div>
    ${pokemonTypeTemplate.contentHtml}
  \`,
  
  imports: [CommonModule, ClrFocusOnViewInitModule],
})
export class ${pokemonTypeTemplate.name}PokemonComponent {}
`;

    return additionalFiles;
  },
  {}
);
