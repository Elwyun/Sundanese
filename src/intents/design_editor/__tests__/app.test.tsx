import { useFeatureSupport } from "@canva/app-hooks";
import { addElementAtPoint } from "@canva/design";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { App } from "src/intents/design_editor/app";
import { renderInTestProvider } from "src/utils/test_render";

jest.mock("@canva/app-hooks");

describe("Aksara Sunda Tests", () => {
  const mockIsSupported = jest.fn();
  const mockUseFeatureSupport = jest.mocked(useFeatureSupport);
  const mockAddElementAtPoint = jest.mocked(addElementAtPoint);

  beforeEach(() => {
    jest.resetAllMocks();
    mockIsSupported.mockReturnValue(true);
    mockUseFeatureSupport.mockReturnValue(mockIsSupported);
    mockAddElementAtPoint.mockResolvedValue(undefined);
  });

  const convertText = (text: string) => {
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: text } });
    fireEvent.click(screen.getByRole("button", { name: "Convert" }));
  };

  it("should render the app title and mode selector", () => {
    renderInTestProvider(<App />);

    expect(screen.getByText("Sundanese")).toBeTruthy();
    expect(screen.getByText("Latin → Sunda")).toBeTruthy();
    expect(screen.getByText("Sunda → Latin")).toBeTruthy();
  });

  it("should convert Latin text and show the add-to-design button", () => {
    renderInTestProvider(<App />);

    // The add button is hidden until there is converted output
    expect(screen.queryByRole("button", { name: "Add to design" })).toBeNull();

    convertText("wilujeng enjing");

    expect(screen.getByRole("button", { name: "Add to design" })).toBeTruthy();
    expect(screen.getByText("ᮝᮤᮜᮥᮏᮨᮀ ᮈᮔ᮪ᮏᮤᮀ")).toBeTruthy();
  });

  it("should add the converted text to the design with the selected style", async () => {
    renderInTestProvider(<App />);
    convertText("wilujeng enjing");

    fireEvent.click(screen.getByRole("button", { name: "Add to design" }));

    await waitFor(() =>
      expect(mockAddElementAtPoint).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "text",
          children: ["ᮝᮤᮜᮥᮏᮨᮀ ᮈᮔ᮪ᮏᮤᮀ"],
        }),
      ),
    );
  });

  it("should show an error alert when adding to the design fails", async () => {
    mockAddElementAtPoint.mockRejectedValueOnce(new Error("boom"));

    renderInTestProvider(<App />);
    convertText("wilujeng enjing");

    fireEvent.click(screen.getByRole("button", { name: "Add to design" }));

    expect(
      await screen.findByText(
        "Couldn't add the text to your design. Please try again.",
      ),
    ).toBeTruthy();
  });

  it("should convert Sundanese script back to Latin", () => {
    renderInTestProvider(<App />);

    fireEvent.click(screen.getByText("Sunda → Latin"));
    convertText("ᮝᮤᮜᮥᮏᮨᮀ ᮈᮔ᮪ᮏᮤᮀ");

    expect(screen.getByText("wilujeng enjing")).toBeTruthy();
  });
});
