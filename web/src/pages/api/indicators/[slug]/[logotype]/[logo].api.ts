import { BadgingFields, getImage, getProductDetail } from '@/feeds/publications/publications';
import { slugify } from '@/utils/url';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	const { slug, logo, logotype } = req.query;

	if (!slug || !logo || !logotype) {
		return null;
	}

	const [product] = await Promise.all([
			getProductDetail(slug as string),
		]);

	let logoDetails:BadgingFields | undefined;

	switch (logotype as string) {
		case "author":
			logoDetails = product?.additionalAuthorList.find(
					(author) => slugify(author.name, { lowercase: true}) === logo
				);
			break;
		case "accreditation":
			logoDetails = product?.accreditationList.find(
				(accreditation) => slugify(accreditation.name, { lowercase: true}) === logo
			);
			break;
		default:
			console.log("Unrecognised logo type");
			break;

	}

	if (!logoDetails || !logoDetails.logo?.url) {
		return res.status(404).json({ error: 'Accreditation logo not found' });
	}

	const imageBuffer = await getImage(logoDetails.logo.url);

	res.setHeader('Content-Type', 'image/png');
	res.setHeader('Content-Disposition', 'inline');
	res.status(200).send(imageBuffer);
	res.end();
}
