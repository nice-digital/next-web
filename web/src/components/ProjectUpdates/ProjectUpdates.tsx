import { FC } from "react";

import { Link } from "../Link/Link";

export type Update = { title: string; id: string; productPath: string };

export type UpdatesProps = {
	fullUpdates: Update[];
	partialUpdates: Update[];
};

export const Updates: FC<UpdatesProps> = ({
	fullUpdates,
	partialUpdates,
}): JSX.Element => {
	return (
		<>
			{fullUpdates && fullUpdates.length > 0 ? (
				<>
					<p>This guidance will fully update the following:</p>
					<ul>
						{fullUpdates?.map((product, index) => {
							return (
								<li key={`${product.title}_${index}`}>
									<Link to={product.productPath}>
										<a>
											{product.title} ({product.id})
										</a>
									</Link>
								</li>
							);
						})}
					</ul>
				</>
			) : null}

			{partialUpdates && partialUpdates.length > 0 ? (
				<>
					<p>This guidance will partially update the following:</p>
					<ul>
						{partialUpdates?.map((product, index) => {
							return (
								<li key={`${product.title}_${index}`}>
									<Link to={product.productPath}>
										<a>
											{product.title} ({product.id})
										</a>
									</Link>
								</li>
							);
						})}
					</ul>
				</>
			) : null}
		</>
	);
};
