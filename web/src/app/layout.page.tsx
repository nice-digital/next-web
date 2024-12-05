import { Inter, Lora } from "next/font/google";
import React, { FC } from "react";

import "@nice-digital/design-system/scss/base.scss";

import "./global.scss";
import LayoutClient from "./layout-client";

const inter = Inter({ subsets: ["latin"], variable: "--sans-font-family" });
const lora = Lora({ subsets: ["latin"], variable: "--serif-font-family" });

type Props = {
	children: React.ReactNode;
};

const Layout: FC<Props> = ({ children }) => {
	return (
		<html lang="en">
			<body className={`${lora.variable} ${inter.variable}`}>
				<LayoutClient>{children}</LayoutClient>
			</body>
		</html>
	);
};

export default Layout;
