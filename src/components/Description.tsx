import React from "react";
import useSWR from "swr";

interface DescriptionData {
  description: string;
}

interface DescriptionProps {
  id: number | undefined;
}

export default function Description({ id }: DescriptionProps) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;

  const { data, error } = useSWR<DescriptionData>(
    url,
    async (url: string) => {
      const response = await fetch(url);
      const result = await response.json();
      return {
        description: result.flavor_text_entries[0].flavor_text,
      };
    },
    { revalidateOnFocus: false }
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <p className="italicize">{data?.description}</p>
    </div>
  );
}
