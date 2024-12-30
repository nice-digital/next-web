import { Inter, Lora } from "next/font/google";
import React, { FC } from "react";
import { EnvVarsType, getNextPublicEnvVars } from "src/config/config-utils";

import "@nice-digital/design-system/scss/base.scss";
import "./global.scss";
import LayoutClient from "./layout-client";

const inter = Inter({ subsets: ["latin"], variable: "--sans-font-family" });
const lora = Lora({ subsets: ["latin"], variable: "--serif-font-family" });

type Props = {
	children: React.ReactNode;
};

const Layout: FC<Props> = async ({ children }) => {
	const envVars: EnvVarsType = await getNextPublicEnvVars(); // Fetch env vars

	return (
		<html lang="en">
			<body className={`${lora.variable} ${inter.variable}`}>
				{/* Pass envVars to LayoutClient */}
				<LayoutClient envVars={envVars}>{children}</LayoutClient>
			</body>
		</html>
	);
};

export default Layout;
