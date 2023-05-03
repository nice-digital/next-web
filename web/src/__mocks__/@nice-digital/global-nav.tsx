// Mock global nav as an empty function as there's so much markup it causes loads of noise
// when tests fail and React Testing Library lists nodes for debugging purposes.
// Use jest.requireActual("@nice-digital/global-nav"); if you need the original implementation for testing purposes

import { FC, PropsWithChildren } from "react";

export const Header: FC = jest.fn().mockImplementation(() => null);

export const Footer: FC = jest.fn().mockImplementation(() => null);

// Mock a simpler version of main (without back to top) to avoid noise in tests and snapshots
export const Main = jest.fn(
	({ children }: PropsWithChildren<Record<string, never>>) => (
		<main>{children}</main>
	)
);
