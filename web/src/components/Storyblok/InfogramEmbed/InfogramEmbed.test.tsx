import { render, screen } from "@testing-library/react";
import InfogramEmbed from "./InfogramEmbed";
import { InfogramEmbedStoryblok } from "@/types/storyblok";

// Mock next/script to simulate script loading
jest.mock("next/script", () => (props: any) => {
  props.onLoad?.(); // simulate the script onLoad event
  return <div data-testid="mock-script" />;
});

const mockInfogramProps: InfogramEmbedStoryblok = {
  infogramUrl: "https://infogram.com/ta-cancer-decisions-by-type-1hxj48nzk5x54vg",
  infogramVariant: "interactive",
  layoutVariant: "default",
  component: "infogramEmbed",
  _uid: "mock-uid-1",
};
describe("InfogramEmbed", () => {
  const validUrl = "https://infogram.com/ta-cancer-decisions-by-type-1hxj48nzk5x54vg";
  const infogramId = "ta-cancer-decisions-by-type-1hxj48nzk5x54vg";

  beforeEach(() => {
    // Cleanup and reset global object before each test
    document.getElementById("infogram-async")?.remove();
    (window as any).infogramEmbeds = {
      load: jest.fn(),
    };
  });

  it("renders with valid URL and default variants", () => {
    render(
      <InfogramEmbed
        blok={mockInfogramProps}
      />
    );
    const embed = screen.getByTestId(infogramId);
    expect(embed).toBeInTheDocument();
    expect(embed).toHaveAttribute("data-id", infogramId);
    expect(embed).toHaveAttribute("data-type", "interactive");
  });

  it("renders with a different infogramVariant", () => {
    render(
      <InfogramEmbed
        blok={{ ...mockInfogramProps, infogramVariant: "static" }}
      />
    );
    const embed = screen.getByTestId(infogramId);
    expect(embed).toHaveAttribute("data-type", "static");
  });

  it("renders with a non-default layoutVariant", () => {
    render(
      <InfogramEmbed
        blok={{
          ...mockInfogramProps,
          layoutVariant: "fullwidth",
        }}
      />
    );
     const embed = screen.getByTestId(infogramId);
    expect(embed.className).toContain("infogram-embed");
    expect(embed.className).not.toContain("infogramEmbed__default");
  });

  it("shows error message when URL is invalid", () => {
    render(
      <InfogramEmbed
        blok={{
					...mockInfogramProps,
          infogramUrl: "",
        }}
      />
    );
    expect(screen.getByText(/Invalid or missing Infogram URL/i)).toBeInTheDocument();
  });

  it("does not inject script again if already in DOM", () => {
    // Manually add the script element before rendering
    const script = document.createElement("script");
    script.id = "infogram-async";
    document.body.appendChild(script);

    render(
      <InfogramEmbed
        blok={{
					...mockInfogramProps,
          infogramUrl: validUrl,
        }}
      />
    );

    expect(screen.queryByTestId("mock-script")).not.toBeInTheDocument();
  });

  it("calls infogramEmbeds.load if script already exists", () => {
    // Create script before render to simulate existing load
    const script = document.createElement("script");
    script.id = "infogram-async";
    document.body.appendChild(script);

    render(
      <InfogramEmbed
        blok={{
					...mockInfogramProps,
          infogramUrl: validUrl,
        }}
      />
    );

    expect(window.infogramEmbeds?.load).toHaveBeenCalled();
  });
});
