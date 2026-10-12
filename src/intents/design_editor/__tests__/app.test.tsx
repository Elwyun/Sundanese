import { useFeatureSupport } from "@canva/app-hooks";
import { addElementAtPoint } from "@canva/design";
import type { Feature } from "@canva/platform";
import { fireEvent, screen } from "@testing-library/react";
import { App } from "src/intents/design_editor/app";
import { renderInTestProvider } from "src/utils/test_render";

jest.mock("@canva/app-hooks");

describe("Aksara Sunda Tests", () => {
  const mockIsSupported = jest.fn();
  const mockUseFeatureSupport = jest.mocked(useFeatureSupport);

  beforeEach(() => {
    jest.resetAllMocks();
    mockIsSupported.mockImplementation(
      (fn: Feature) => fn === addElementAtPoint,
    );
    mockUseFeatureSupport.mockReturnValue(mockIsSupported);
  });

  it("should render the app title and mode selector", () => {
    renderInTestProvider(<App />);

    expect(screen.getByText("Aksara Sunda")).toBeTruthy();
    expect(screen.getByText("Latin → Sunda")).toBeTruthy();
    expect(screen.getByText("Sunda → Latin")).toBeTruthy();
  });

  it("should convert Latin text and show the add-to-design button", () => {
    renderInTestProvider(<App />);

    // The add button is hidden until there is converted output
    expect(screen.queryByRole("button", { name: "Tambahkan ke Design" })).toBe(
      null,
    );

    // Type Latin text and convert
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "wilujeng enjing" } });
    fireEvent.click(screen.getByRole("button", { name: "Konversi" }));

    // The add-to-design button should now appear
    expect(screen.getByRole("button", { name: "Tambahkan ke Design" })).toBeTruthy();
  });
});
