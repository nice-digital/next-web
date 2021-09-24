// Mock global nav as an empty function as there's so much markup it causes loads of noise
// when tests fail and React Testing Library lists nodes for debugging purposes.
// Use jest.requireActual("@nice-digital/global-nav"); if you need the original implementation for testing purposes

import { FC } from "react";

export const Header: FC = jest.fn().mockImplementation(() => null);

export const Footer: FC = jest.fn().mockImplementation(() => null);
