import { offset } from "@popperjs/core";
import useSWR from "swr";
import { Attack } from "./Attack";
import Description from "./Description";
import "./PokemonCard.css";

type PokemonCardProps = {
  pokeName: string;
};

interface PokemonTypesData {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonData {
  name: string;
  id: number;
  sprites: string;
  types: PokemonTypesData[];
  height: number;
  weight: number;
  hp: number;
  move: { name: string; url: string };
  species: { name: string; url: string };
}

export default function PokemonCard({ pokeName }: PokemonCardProps) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokeName}/`;

  const { data, error } = useSWR<PokemonData>(
    url,
    async (url) => {
      const response = await fetch(url);
      const result = await response.json();
      const moveCount = result.moves.length;
      const random = Math.floor(Math.random() * moveCount);
      return {
        name: result.name,
        id: result.id,
        sprites: result.sprites.front_default,
        types: result.types,
        height: result.height,
        weight: result.weight,
        hp: result.stats[0].base_stat,
        move: result.moves[random].move,
        species: result.species,
      };
    },
    { revalidateOnFocus: false }
  );
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const attackIdArray = data.move.url.match(/\/(\d+)\/$/);
  const speciesIdArray = data.species.url.match(/\/(\d+)\/$/);

  let attackId: number | undefined;
  let speciesId: number | undefined;

  if (attackIdArray !== null) {
    attackId = +attackIdArray[1];
  }
  if (speciesIdArray !== null) {
    speciesId = +speciesIdArray[1];
  }

  let type: string;

  if (data.types.some((type) => type.type.name === "water")) {
    type = "water";
  } else if (data.types.some((type) => type.type.name === "fire")) {
    type = "fire";
  } else if (data.types.some((type) => type.type.name === "electric")) {
    type = "electric";
  } else if (data.types.some((type) => type.type.name === "grass")) {
    type = "grass";
  } else if (data.types.some((type) => type.type.name === "poison")) {
    type = "poison";
  } else {
    type = "normal";
  }

  return (
    <div className="container py-4">
      <div className={`card ${type}-type`}>
        <table className="nameheaders">
          <tr>
            <td className="basic" colSpan={3}>
              Basic Pokémon
            </td>
          </tr>
          <tr style={{ width: "100%" }}>
            <td className="nameofanimal">{capitalizeFirstLetter(data.name)}</td>
            <td className="hp">{data.hp} HP</td>
            <img
              src="https://heatherketten.files.wordpress.com/2018/03/nrg_leaf.png"
              width="20"
              height="20"
              alt="leaf"
            />
          </tr>
        </table>

        <img
          src={
            data.sprites !== null
              ? data.sprites
              : "https://www.freepnglogos.com/uploads/pok-mon-go-logo-png-30.png"
          }
          className="card-img-top"
          alt="Pokemon Img"
        />
        <div className="description">
          Type: {data.types.map((entry) => entry.type.name).join(", ")} /
          Heigth: {data.height / 10}m / Weight: {data.weight / 10}kg
        </div>

        <div className="card-body">
          <Attack id={attackId} />
          <hr />

          <table className="costs">
            <tr className="costheaders">
              <td>weakness</td>
              <td>resistance</td>
              <td>retreat cost</td>
            </tr>
            <tr className="costicons">
              <td>
                <img
                  src="https://heatherketten.files.wordpress.com/2018/03/nrg_fire.png"
                  width="20"
                  height="20"
                  alt="fire"
                />
              </td>
              <td></td>
              <td>
                <img
                  src="https://heatherketten.files.wordpress.com/2018/03/nrg_normal.png"
                  width="20"
                  height="20"
                  alt="normal"
                />
              </td>
            </tr>
          </table>
          <Description id={speciesId} />
        </div>
      </div>
    </div>
  );
}
