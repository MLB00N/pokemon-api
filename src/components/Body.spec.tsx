import { render, waitFor } from "@testing-library/react";
import { Body } from "./Body";
import fetchMock from "fetch-mock-jest";

describe("Body", () => {
  it("should render w/o crashing", async () => {
    fetchMock.getOnce(
      'https://pokeapi.co/api/v2/pokemon/?limit=8&offset=0"',
      {}
    );

    const instance = render(<Body />);

    await waitFor(() => {
      expect(instance.getByText("Bulbasaur")).toBeVisible();
    });
  });
});
