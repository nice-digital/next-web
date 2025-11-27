import { StoryblokComponent } from "@storyblok/react";

import { Grid, GridItem } from "@nice-digital/nds-grid";
import { Panel } from "@nice-digital/nds-panel";

import { type Breadcrumb } from "@/types/Breadcrumb";
import { type FormPageStoryblok } from "@/types/storyblok";

import styles from "./FormPage.module.scss";

export interface FormPageProps {
	blok: FormPageStoryblok;
	breadcrumbs?: Breadcrumb[];
}

export const FormPage = ({
	blok,
	breadcrumbs,
}: FormPageProps): React.ReactElement => {
	return (
		<div className={styles.formPage}>
			{blok.metadata &&
				blok.metadata.length > 0 &&
				blok.metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			{blok.header &&
				blok.header.map((nestedBlok) => (
					<StoryblokComponent
						blok={nestedBlok}
						key={nestedBlok._uid}
						breadcrumbs={breadcrumbs}
					/>
				))}

			<Grid gutter="loose">
				<GridItem cols={12} md={blok.panel ? 8 : 12}>
					{blok.content &&
						blok.content.map((nestedBlok) => (
							<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
						))}
				</GridItem>
				{blok.panel && (
					<GridItem cols={12} md={4}>
						{blok.panel.map((nestedBlok) => (
							<Panel key={nestedBlok._uid}>
								<StoryblokComponent blok={nestedBlok} />
							</Panel>
						))}
					</GridItem>
				)}
			</Grid>
		</div>
	);
};
