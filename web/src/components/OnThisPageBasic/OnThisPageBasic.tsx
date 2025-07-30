import { FC } from "react";
import striptags from "striptags";

export type OnThisPageBasicSection = {
	slug: string;
	title: string;
};

export type OnThisPageBasicProps = {
	sections: OnThisPageBasicSection[];
};

export const OnThisPageBasic: FC<OnThisPageBasicProps> = ({ sections }) => {
	if (sections.length <= 1) return null;

	return (
		<nav
			className="in-page-nav in-page-nav--no-scroll"
			aria-labelledby="on-this-page"
		>
			<h2 id="on-this-page" className="in-page-nav__title">
				On this page
			</h2>
			<ol
				className="in-page-nav__list"
				aria-label="Jump links to sections on this page"
			>
				{sections.map(({ slug, title }) => (
					<li className="in-page-nav__item" key={slug}>
						<a id={`inpagenav-${slug}`} href={`#${slug}`}>
							{striptags(title)}
						</a>
					</li>
				))}
			</ol>
		</nav>
	);
};
