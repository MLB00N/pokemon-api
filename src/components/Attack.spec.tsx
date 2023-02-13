import { Attack } from "./Attack";
import fetchMock from "fetch-mock-jest";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import $ from "jquery";

describe("Attack", () => {
  it("should render w/o crashing", async () => {
    fetchMock.getOnce(
      'https://pokeapi.co/api/v2/pokemon/?limit=8&offset=0"',
      {}
    );
    jest.mock("jquery");

    const instance = render(<Attack id={1} />);

    await waitFor(() => {
      expect(instance.getAllByRole("img")).toHaveLength(2);
    });
  });
});
