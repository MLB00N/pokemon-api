import useSWR from "swr";
import React from "react";

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

interface AttackData {
  effect: string;
  effect_short: string;
  effect_chance: string;
  name: string;
  pp: number;
  type: string;
}

interface AttackProps {
  id: number | undefined;
}

export function Attack({ id }: AttackProps) {
  const url = `https://pokeapi.co/api/v2/move/${id}/`;

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const { data, error } = useSWR<AttackData>(
    url,
    async (url) => {
      const response = await fetch(url);
      const result = await response.json();
      return {
        name: result.name,
        effect: result.effect_entries[0].effect,
        effect_short: result.effect_entries[0].short_effect,
        type: result.type,
        pp: result.pp,
        effect_chance: result.effect_chance,
      };
    },
    { revalidateOnFocus: false }
  );
  if (error) return <div>Ooooops, something went wrong</div>;
  if (!data) return <div>Loading...</div>;

  const effectChance = data.effect_chance;

  let completeText = data.effect;
  let shortText = data.effect_short;

  if (completeText.includes("$effect_chance")) {
    completeText = completeText.replace("$effect_chance", effectChance);
  }
  if (shortText.includes("$effect_chance")) {
    shortText = shortText.replace("$effect_chance", effectChance);
  }

  return (
    <div>
      <table className="stats">
        <tr>
          <td className="energy">
            <div className="symbolWrapper">
              <img
                src="https://heatherketten.files.wordpress.com/2018/03/nrg_leaf.png"
                width="20"
                height="20"
              />
              <img
                src="https://heatherketten.files.wordpress.com/2018/03/nrg_leaf.png"
                width="20"
                height="20"
              />
            </div>
          </td>
          <td className="attack">
            <span className="label">{capitalizeFirstLetter(data.name)} </span>
            <span
              className="labeltext"
              data-toggle="tooltip"
              data-placement="top"
              title={completeText}
            >
              {shortText}
              <br />{" "}
            </span>
          </td>
          <td className="damage">{data.pp}</td>
        </tr>
      </table>
    </div>
  );
}
