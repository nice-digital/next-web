import { render, screen, waitFor } from "@testing-library/react";

import { Announcer } from "./Announcer";

describe("Announcer", () => {
	it("should set announcement in text content on NextJS announcer element", async () => {
		const announcer = document.createElement("div");
		announcer.id = "__next-route-announcer__";
		announcer.setAttribute("aria-live", "assertive");
		announcer.setAttribute("role", "alert");
		document.body.appendChild(announcer);

		render(<Announcer announcement="Test announcement" />);

		await waitFor(() =>
			expect(screen.getByRole("alert")).toHaveTextContent("Test announcement")
		);

		announcer.remove();
	});
});
