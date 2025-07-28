// @ts-check
const path = require("path");

const config = require("config"),
	glob = require("glob"),
	withNodeConfig = require("next-plugin-node-config");

/**
 * A list of paths to hooks used in global nav that should allow transpilation.
 *
 * Avoids the error "cannot use import outside a module"
 */
const globalNavHooksToTranspile = [
	"@mantine/hooks/esm/use-debounced-value",
	"@mantine/hooks/esm/use-focus-trap",
];

/**
 * A list of paths to node modules that should allow transpilation.
 * Most of our Design System components (and Global Nav) import SCSS.
 *
 * Avoids the error "CSS Modules cannot be imported from within node_modules."
 */
const niceDigitalModulesToTranspile = glob.sync(
	"@nice-digital/{*,*/node_modules/@nice-digital/*}",
	{
		cwd: "node_modules",
	}
);

/**
 * Some npm modules are published as ES6, so we need to force them to be transpiled
 * so they're ES5 compatible whilst we still support IE11.
 *
 * As per comment at https://github.com/vercel/next.js/discussions/13922#discussioncomment-23956
 */
const nonES5ModulesToTranspile = ["pino", "serialize-error"];

const commonHeaders = [
	{
		key: "Cache-Control",
		value: config.get("public.cacheControl.defaultCacheHeader"),
	},
	{
		key: "X-App",
		value: "next-web",
	},
	/**
	 * 'Best practice' security headers as per https://edibleco.de/3xcg71N
	 */
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains; preload",
	},
	{
		key: "X-XSS-Protection",
		value: "1; mode=block",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
	},
	/**
	 * Preload external assets and preconnecting external domains via Link header
	 */
	{
		key: "Link",
		value: [
			// Preload the cookie banner with API key domain preconnect - we want the cookie banner to show as quickly as possible
			`<${config.get("public.cookieBannerScriptURL")}>; rel=preload; as=script`,
			"<https://apikeys.civiccomputing.com>; rel=preconnect; crossorigin",
			"<https://www.googletagmanager.com>; rel=preconnect",
		].join(","),
	},
];

// Prevent emebdding this site in frames in production, but allow it in dev so we can use the Storyblok preview editor
if (process.env.NODE_ENV === "production") {
	commonHeaders.push(
		{
			key: "X-Frame-Options",
			value: "DENY",
		},
		{
			key: "Content-Security-Policy",
			value: "frame-ancestors 'self' https://*.infogram.com",
		}
	);
}

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	nodeConfigServerKey: "server",
	nodeConfigPublicKey: "public",
	// Strict mode gives useful feedback in dev, see https://edibleco.de/3x9GXry
	reactStrictMode: true,
	eslint: {
		// We run ESLint ourselves at the root of this monorepo
		ignoreDuringBuilds: true,
	},
	// Add page.tsx for test co-location, see https://edibleco.de/3qCAkvg
	pageExtensions: ["page.tsx", "api.ts"],
	// Don't send the x-powered-by header: we don't want to expose things like that. See https://edibleco.de/2TpDVAK
	poweredByHeader: false,
	async rewrites() {
		return [
			{
				source:
					"/:productRoot(indicators|guidance)/:statusSlug(indevelopment|discontinued|awaiting-development|topic-selection)/:path*",
				destination:
					"/indicators/indevelopment/:path*?productRoot=:productRoot&statusSlug=:statusSlug",
			},
			{
				source:
					"/:productRoot(indicators|guidance|advice|process|corporate)/:path+",
				destination: "/indicators/:path*?productRoot=:productRoot",
			},
			{
				source: "/robots.txt",
				destination: "/api/robots",
			},
		];
	},
	async redirects() {
		return [
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-consultation/Costs-used-in-health-technology-assessment-task-and-finish-group-report.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-consultation/Alignment-of-cost-comparison-methods-task-and-finish-group-report.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-consultation/Sources-and-synthesis-of-evidence-task-and-finish-group-report.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-consultation/NICE-methods-of-health-technology-evaluation-case-for-change.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-consultation/Health-related-quality-of-life-task-and-finish-group-report.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation/benefits-realisation-and-impact-tfg-report.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-consultation/Technology-specific-issues-task-and-finish-group-report.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation/appendix-real-world-evidence-framework.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-consultation/Exploring-uncertainity-task-and-finish-group-report.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation/health-technology-evaluations-manual.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation/dsu-report-on-consultation-responses.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation/developing-the-manual-tfg-report.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation/consultation-response-tfg-report.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-consultation/Decision-making-task-and-finish-group-report.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation/topic-selection-proposal-paper.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-consultation/Discounting-task-and-finish-group-report.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-consultation/Equalities-task-and-finish-group-report.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-consultation/Modifiers-task-and-finish-group-report.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-consultation/Task-and-finish-group-specifications.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation/process-proposal-paper.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation/methods-proposal-paper.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation/topic-selection-manual.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation/consultation-overview.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation/introduction-paper.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/our-programmes/nice-guidance/chte-process-consultation/Review-of-HTE-processes.docx",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/Decision%20Support%20Unit-%20Structured%20decision%20making%20framework.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/Technology-appraisals-methods-guide-review-2014-consultation-proforma.doc",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/NICE-Communities/Library-and-knowledge-services-staff/Training-materials/NICE-Evidence-Search-evidence-type-definitions.docx",
				destination:
					"/about/what-we-do/evidence-and-best-practice-resources/evidence-search/evidence-search-service-closure-information",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/DH-Using-a-set-of-Reference-Estimates-to-support-value-assessment.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/NICE-Communities/Library-and-knowledge-services-staff/Training-materials/NICE-Evidence-Search-reference-slide-set.pptx",
				destination:
					"/about/what-we-do/evidence-and-best-practice-resources/evidence-search/evidence-search-service-closure-information",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisal-guidance/chemotherpay-dose-standardisation-position-statement.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/chemotherapy-dose-standardisation-nice-position-statement",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/NICE-Communities/Library-and-knowledge-services-staff/Training-materials/NICE-Evidence-Search-Quick-Guide.docx",
				destination:
					"/about/what-we-do/evidence-and-best-practice-resources/evidence-search/evidence-search-service-closure-information",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/technology-appraisal-guidance/Biosimilars-information-for-the-public-April-2017.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/biosimilar-technologies-nice-position-statement-information-for-the-public",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/OHE-Note-on-proportional-versus-absolute-shortfall.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/DSU-Specification-VBP-II---Wider-Societal-Benefits.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/NICE-Communities/Library-and-knowledge-services-staff/Training-materials/HDAS-full-user-guide-Feb-17.docx",
				destination:
					"/about/what-we-do/evidence-services/journals-and-databases/hdas-closure-information",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/biosimilar-medicines-postition-statement-aug-16.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/biosimilar-technologies-nice-position-statement",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/DH-Briefing-document-for-NICE-Working-Party-1.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/DH-Documentation-for-Wider-Societal-Benefits.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/NICE-Communities/Library-and-knowledge-services-staff/Training-materials/HDAS-quick-guide-feb-17.pub",
				destination:
					"/about/what-we-do/evidence-services/journals-and-databases/hdas-closure-information",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/DSU-Specification-VBP-I---Burden-of-Illness.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/DSU-Wider-Societal-Benefits-Briefing-Paper.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/antimicrobial%20guidance/summary-antimicrobial-prescribing-guidance.pdf",
				destination:
					"/guidance/health-protection/communicable-diseases/antimicrobial-stewardship#summary",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/Illustrative-TA-list-and-QALY-shortfall.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisal-guidance/eq5d5l_nice_position_statement.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/eq-5d-5l",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/VBA-TA-Methods-Guide-for-Consultation.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/NICE-Communities/Social-care/Commissioning%20resource/NICE-quality-improvement-resource.xlsx",
				destination:
					"/about/what-we-do/into-practice/mapping-nice-guidelines-to-the-care-quality-commission-s-single-assessment-framework",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/DSU-Burden-of-Illness-Briefing-Paper.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/DSU_Burden_of_Illness_Briefing_Paper.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/about/what-we-do/nice-guidance/nice-medical-technologies/MTEP-expert-adviser-questionnaire.pdf",
				destination:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-medical-technologies/MTEP-expert-adviser-questionnaire.docx",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-medical-technologies/MTEP-notification-form-mar-17.docx",
				destination:
					"/Media/Default/about/what-we-do/nice-guidance/nice-medical-technologies/MTEP-notification-form.docx",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/charging/timelines-hst",
				destination:
					"/Media/Default/About/what-we-do/NICE-guidance/technology-appraisal-guidance/ta-hst-charging-process.pdf",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/charging/procedure-hst",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/charging/procedure-tahst",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/charging/timelines-ta",
				destination:
					"/Media/Default/About/what-we-do/NICE-guidance/technology-appraisal-guidance/ta-hst-charging-process.pdf",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/charging/procedure-ta",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/charging/procedure-tahst",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/process/sta-timeline",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/process/sta-timeline",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-technology-appraisals/VBA-Consultation-Comments.pdf",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-advice/Key-therapeutic-topics/Key-therapeutic-topics-2015-1.pdf",
				destination:
					"/About/What-we-do/Our-Programmes/NICE-Advice/Key-therapeutic-topics",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-medical-technologies/MTEP-notification-form.pdf",
				destination:
					"/Media/Default/about/what-we-do/nice-guidance/nice-medical-technologies/MTEP-notification-form.docx",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-highly-specialised-technologies-guidance/proposed-highly-specialised-technology-evaluations",
				destination: "/guidance/proposed?type=hst",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/cancer-drugs-fund-new-process-proposal-consultation-2015",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/cancer-drugs-fund",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/abbreviated-technology-appraisal-process-consultation-",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/abbreviated-technology-appraisal-process-consultation",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/models-for-the-evaluation-and-purchase-of-antimicrobials/ceftazidime-with-avibactam",
				destination: "/guidance/hte1",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/methods-of-technology-appraisal-consultation",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/models-for-the-evaluation-and-purchase-of-antimicrobials/cefiderocol",
				destination: "/guidance/hte2",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/medical-technologies-guidance/medical-technologies-guidance-static-list",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-medical-technologies-guidance#static-list",
				permanent: true,
			},
			{
				source:
					"/media/default/About/NICE-Communities/Library-and-knowledge-services-staff/How-does-my-HDAS-search-map-in-ProQuest.pdf",
				destination:
					"/about/what-we-do/evidence-services/journals-and-databases/hdas-closure-information",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/technology-appraisal-static-list",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/scientific-advice-education-and-training-/speaking-engagements",
				destination:
					"/about/what-we-do/life-sciences/scientific-advice/education-and-training",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-register-an-interest",
				destination: "/forms/interventional-procedures-register-an-interest",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-notification-form",
				destination: "/forms/interventional-procedures-notification",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/types-of-recommendation",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/types-of-nice-recommendation",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-diagnostics-guidance/diagnostics-guidance-static-list",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-diagnostics-guidance#static-list",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/scientific-advice-education-and-training-/site-visits",
				destination:
					"/about/what-we-do/life-sciences/scientific-advice/education-and-training",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/using-nice-guidelines-to-make-decisions",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/making-decisions-using-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/scientific-advice-education-and-training-/seminars",
				destination:
					"/about/what-we-do/life-sciences/scientific-advice/education-and-training",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/interventional-procedures-guidance/recommendations",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/types-of-nice-recommendation",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/nice-medicines-practice-guidelines",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/types-of-guideline",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/nice-public-health-guidelines",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/types-of-guideline",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/nice-safe-staffing-guidelines",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/types-of-guideline",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/nice-social-care-guidelines",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/types-of-guideline",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/nice-clinical-guidelines",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/types-of-guideline",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/Who-we-are/Policies-and-procedures/Information-charter.pdf",
				destination:
					"/Media/Default/About/Who-we-are/Policies-and-procedures/FOI-policy-and-complaints-procedure.docx",
				permanent: true,
			},
			{
				source:
					"/media/default/about/who-we-are/board/senior-manager-interests-register.docx",
				destination:
					"/about/who-we-are/board-executive-team-and-senior-leaders-interests-register",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/Who-we-are/Board/Senior-manager-interests-register.docx",
				destination:
					"/about/who-we-are/board-executive-team-and-senior-leaders-interests-register",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/what-lay-members-do/lay-member-payments-and-expenses/how-lay-member-payments-affect-benefits",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/european-health-technology-assessment-and-regulatory-concurrent-advice",
				destination: "/about/what-we-do/life-sciences/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/reviewing-our-process-for-health-technology-evaluation--consultation",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/models-for-the-evaluation-and-purchase-of-antimicrobials",
				destination:
					"/about/what-we-do/life-sciences/nice-advice-service/models-for-the-evaluation-and-purchase-of-antimicrobials",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-advice/evidence-summaries-medicines-and-prescribing-briefings",
				destination: "/about/what-we-do/our-programmes/nice-advice",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/commissioning-support-programme/how-we-support-policy-development",
				destination:
					"/about/what-we-do/our-programmes/commissioning-support-programme",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-advice/evidence-summaries-unlicensed-or-off-label-medicines",
				destination: "/about/what-we-do/our-programmes/nice-advice",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/nice-international/about-nice-international/nice-international-advisory-group",
				destination: "/about/what-we-do/nice-international",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/public-involvement-programme",
				destination:
					"/about/nice-communities/nice-and-the-public/public-involvement",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/nice-international/about-nice-international/nice-international-associates",
				destination: "/about/what-we-do/nice-international",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/chte-methods-and-processes-consultation",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/commissioning-support-programme/policy-working-groups",
				destination:
					"/about/what-we-do/our-programmes/commissioning-support-programme",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/measuring-the-impact-of-nice-guidance/uptake-reports",
				destination:
					"/about/what-we-do/into-practice/measuring-the-uptake-of-nice-guidance/uptake-data",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/antimicrobial-prescribing-guidelines",
				destination:
					"/guidance/health-protection/communicable-diseases/antimicrobial-stewardship",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/local-practice-collection/shared-learning-awards",
				destination:
					"/about/what-we-do/into-practice/local-practice-case-studies/shared-learning-awards",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/nice-resource-impact-assessments/learning-events",
				destination:
					"/about/what-we-do/into-practice/resource-impact-assessment",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/commissioning-support-programme/working-with-us",
				destination:
					"/about/what-we-do/our-programmes/commissioning-support-programme",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/nice-cadth-scientific-advice",
				destination: "/about/what-we-do/life-sciences/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/commissioning-support-programme/our-documents",
				destination:
					"/about/what-we-do/our-programmes/commissioning-support-programme",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-advice/evidence-summaries-new-medicines",
				destination: "/about/what-we-do/our-programmes/nice-advice",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/evidence-search/evidence-search-content",
				destination:
					"/about/what-we-do/evidence-and-best-practice-resources/evidence-search/evidence-search-service-closure-information",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/pharmaceutical-products",
				destination: "/about/what-we-do/life-sciences/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/devices-and-diagnostics",
				destination: "/about/what-we-do/life-sciences/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/commissioning-support-programme/our-work",
				destination:
					"/about/what-we-do/our-programmes/commissioning-support-programme",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/chte-methods-consultation",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/evidence-search/how-to-search",
				destination:
					"/about/what-we-do/evidence-and-best-practice-resources/evidence-search/evidence-search-service-closure-information",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/medtech-advice",
				destination: "/about/what-we-do/life-sciences/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/case-studies",
				destination: "/about/what-we-do/life-sciences/nice-advice-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences/scientific-advice/prima",
				destination: "/about/what-we-do/life-sciences/nice-advice-service",
				permanent: true,
			},
			{
				source: "/Media/Default/News/Events/speaker-request-form.doc",
				destination:
					"https://online1.snapsurveys.com/interview/4091d4a8-5c04-44fb-b6fd-87e8ef3ac7ce",
				permanent: true,
			},
			{
				source: "/guidance/cg44/ifp/chapter/about-this-information",
				destination:
					"/guidance/CG44/ifp/chapter/Treatment-and-care-for-women-with-heavy-periods",
				permanent: true,
			},
			{
				source: "/guidance/cg180/patientdecisionaid/pdf/english",
				destination: "/guidance/cg180/resources",
				permanent: true,
			},
			{
				source: "/nicemedia/live/11824/36191/36191.pdf",
				destination: "/guidance/cg53",
				permanent: true,
			},
			{
				source: "/nicemedia/live/12131/43330/43330.pdf",
				destination: "/guidance/cg79",
				permanent: true,
			},
			{
				source: "/nicemedia/live/10976/29949/29949.pdf",
				destination: "/guidance/cg31/informationforpublic",
				permanent: true,
			},
			{
				source: "/nicemedia/live/10976/29947/29947.pdf",
				destination: "/guidance/cg31",
				permanent: true,
			},
			{
				source: "/nicemedia/live/14078/62770/62770.pdf",
				destination: "/guidance/cg156",
				permanent: true,
			},
			{
				source: "/nicemedia/live/13029/49399/49399.pdf",
				destination: "/guidance/cg101",
				permanent: true,
			},
			{
				source: "/nicemedia/live/11837/36273/36273.pdf",
				destination: "/guidance/cg55",
				permanent: true,
			},
			{
				source: "/nicemedia/live/11004/30436/30436.pdf",
				destination: "/guidance/cg45",
				permanent: true,
			},
			{
				source: "/nicemedia/live/10932/29218/29218.pdf",
				destination: "/guidance/cg9",
				permanent: true,
			},
			{
				source: "/nicemedia/live/14181/64088/64088.pdf",
				destination: "/guidance/cg161",
				permanent: true,
			},
			{
				source: "/nicemedia/live/11926/39557/39557.pdf",
				destination: "/guidance/cg59",
				permanent: true,
			},
			{
				source: "/nicemedia/live/14078/62769/62769.pdf",
				destination: "/guidance/cg156",
				permanent: true,
			},
			{
				source: "/nicemedia/live/12061/42059/42059.pdf",
				destination: "/guidance/cg72",
				permanent: true,
			},
			{
				source: "/nicemedia/live/12986/48678/48678.pdf",
				destination: "/guidance/cg98",
				permanent: true,
			},
			{
				source: "/nicemedia/live/13572/56428/56428.pdf",
				destination:
					"/guidance/conditions-and-diseases/mental-health-and-behavioural-conditions/autism",
				permanent: true,
			},
			{
				source: "/nicemedia/live/13443/61555/61555.pdf",
				destination:
					"/guidance/ph44/documents/physical-activity-brief-advice-in-primary-care-partial-update-of-ph2-economic-modelling-of-brief-advice-on-physical-activity-for-adults-in-primary-care2",
				permanent: true,
			},
			{
				source: "/nicemedia/live/11679/34737/34737.pdf",
				destination: "/guidance/ph8/documents/economics-modelling2",
				permanent: true,
			},
			{
				source:
					"/guidance/cg185/resources/guidance-bipolar-disorder-the-assessment-and-management-of-bipolar-disorder-in-adults-children-and-young-people-in-primary-and-secondary-care-pdf",
				destination: "/guidance/cg185",
				permanent: true,
			},
			{
				source:
					"/guidance/gid-mt252/resources/heartflow-ffrct-for-the-computation-of-fractional-flow-reserve-from-coronary-ct-angiography-stakeholder-registration-form2",
				destination:
					"/Media/Default/Get-involved/stakeholder-registration/Stakeholder_registration_and_confidentiality_form.doc",
				permanent: true,
			},
			{
				source:
					"/guidance/ta341/resources/guidance-apixaban-for-the-treatment-and-secondary-prevention-of-deep-vein-thrombosis-andor-pulmonary-embolism-pdf",
				destination: "/guidance/ta341",
				permanent: true,
			},
			{
				source:
					"/guidance/ipg365/resources/guidance-interspinous-distraction-procedures-for-lumbar-spinal-stenosis-causing-neurogenic-claudication-pdf",
				destination: "/guidance/ipg365",
				permanent: true,
			},
			{
				source:
					"/guidance/ta287/resources/guidance-rivaroxaban-for-treating-pulmonary-embolism-and-preventing-recurrent-venous-thromboembolism-pdf",
				destination: "/guidance/ta287",
				permanent: true,
			},
			{
				source:
					"/guidance/ipg306/resources/ipg306-prosthetic-intervertebral-disc-replacement-in-the-lumbar-spine-understanding-nice-guidance2",
				destination: "/guidance/ipg306",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/health-technology-evaluation-at-nice--what-happens-after-the-transition-period",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/uk-licensing-and-technology-appraisals",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/patient-access-schemes-liaison-unit/list-of-technologies-with-approved-patient-access-schemes",
				destination:
					"/about/what-we-do/patient-access-schemes-liaison-unit#list-of-arrangements",
				permanent: true,
			},
			{
				source:
					"/guidance/ipg524/resources/guidance-ultrasoundenhanced-catheterdirected-thrombolysis-for-pulmonary-embolism-pdf",
				destination: "/guidance/ipg524",
				permanent: true,
			},
			{
				source:
					"/guidance/ph17/evidence/promoting-physical-activity-for-children-and-young-people-evidence-update-march-20152",
				destination:
					"/guidance/ph17/evidence/ph17-promoting-physical-activity-for-children-and-young-people-evidence-update2",
				permanent: true,
			},
			{
				source:
					"/guidance/ipg332/resources/guidance-surgical-correction-of-hallux-valgus-using-minimal-access-techniques-pdf",
				destination: "/guidance/ipg332",
				permanent: true,
			},
			{
				source:
					"/guidance/ipg311/resources/guidance-extracorporeal-shockwave-therapy-for-refractory-plantar-fasciitis-pdf",
				destination: "/guidance/ipg311",
				permanent: true,
			},
			{
				source:
					"/guidance/cg178/resources/guidance-psychosis-and-schizophrenia-in-adults-treatment-and-management-pdf",
				destination: "/guidance/cg178",
				permanent: true,
			},
			{
				source:
					"/guidance/conditions-and-diseases/cardiovascular-conditions/stroke-and-other-circulatory-conditions",
				destination:
					"/guidance/conditions-and-diseases/cardiovascular-conditions/stroke-and-transient-ischaemic-attack",
				permanent: true,
			},
			{
				source:
					"/article/pg1/chapter/2-using-nice-guidance-and-related-quality-standards-in-provider-organisations",
				destination:
					"/process/pmg30/chapter/using-nice-guidance-and-related-quality-standards-in-provider-organisations",
				permanent: true,
			},
			{
				source:
					"/guidance/gid-cgwave0658/resources/macular-degeneration-scope-consultation-comments-and-responses2",
				destination:
					"/guidance/GID-CGWAVE0658/documents/consultation-comments-and-responses",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/nice-evidence-services-issues#report",
				destination: "/what-we-do/evidence-services",
				permanent: true,
			},
			{
				source:
					"/guidance/cg180/resources/guidance-atrial-fibrillation-the-management-of-atrial-fibrillation-pdf",
				destination:
					"/guidance/cg180/resources/atrial-fibrillation-management-35109805981381",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/office-for-market-access/identify-the-most-appropriate-routes-to-nhs-access",
				destination:
					"/about/what-we-do/life-sciences/office-for-market-access/identify-the-most-appropriate-routes-to-nhs-access",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/office-for-market-access/changing-healthcare-landscape-and-your-technology",
				destination:
					"/about/what-we-do/life-sciences/office-for-market-access/changing-healthcare-landscape-and-your-technology",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/evidence-search-process-and-methods-manual-consultation",
				destination: "/about/what-we-do/evidence-services",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/nice-evidence-services-issues",
				destination:
					"/about/what-we-do/evidence-and-best-practice-resources/evidence-search/evidence-search-service-closure-information",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/resources-for-administrators",
				destination: "https://library.hee.nhs.uk/resources/openathens",
				permanent: true,
			},
			{
				source:
					"/guidance/guidance/service-delivery--organisation-and-staffing/acute-and-critical-care",
				destination:
					"/guidance/service-delivery--organisation-and-staffing/acute-and-critical-care",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/nice-syndication-api/syndication-case-study-elseviers-clinical-key",
				destination: "/about/what-we-do/nice-syndication-api",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/quality-standards-advisory-committee/qsac2-members",
				destination:
					"/get-involved/meetings-in-public/quality-standards-advisory-committee/quality-standards-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/quality-standards-advisory-committee/qsac3-members",
				destination:
					"/get-involved/meetings-in-public/quality-standards-advisory-committee/quality-standards-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/what-lay-members-do/lay-member-payments-and-expenses",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/public-involvement/patient-and-public-involvement-policy",
				destination:
					"/about/nice-communities/nice-and-the-public/public-involvement/public-involvement-programme/patient-public-involvement-policy",
				permanent: true,
			},
			{
				source:
					"/guidance/cg180/resources/cg180-atrial-fibrillation-update-patient-decision-aid2",
				destination: "/guidance/cg180/resources",
				permanent: true,
			},
			{
				source:
					"/guidance/gid-mt238/resources/stakeholder-registration-and-confidentiality-form2",
				destination:
					"/Media/Default/Get-involved/stakeholder-registration/Stakeholder_registration_and_confidentiality_form.doc",
				permanent: true,
			},
			{
				source:
					"/guidance/gid-mt271/resources/stakeholder-registration-and-confidentiality-form2",
				destination:
					"/Media/Default/Get-involved/stakeholder-registration/Stakeholder_registration_and_confidentiality_form.doc",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/training-materials",
				destination: "https://library.hee.nhs.uk/resources/openathens",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/scientific-advice/european-early-dialogues-scientific-advice",
				destination:
					"/about/what-we-do/life-sciences/scientific-advice/european-early-dialogues-scientific-advice",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/join-a-committee/how-to-apply-to-join-a-committee",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source:
					"/guidance/cg80/resources/guidance-early-and-locally-advanced-breast-cancer-pdf",
				destination: "/guidance/cg80",
				permanent: true,
			},
			{
				source:
					"/guidance/cg101/resources/guidance-chronic-obstructive-pulmonary-disease-pdf",
				destination: "/guidance/cg101",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/office-for-market-access/early-access-to-medicines-scheme",
				destination:
					"/about/what-we-do/life-sciences/office-for-market-access/early-access-to-medicines-scheme",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/office-for-market-access/safe-harbour-engagement-meetings",
				destination:
					"/about/what-we-do/life-sciences/office-for-market-access/safe-harbour-engagement-meetings",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/office-for-market-access/exploring-your-value-proposition",
				destination:
					"/about/what-we-do/life-sciences/office-for-market-access/exploring-your-value-proposition",
				permanent: true,
			},
			{
				source:
					"/guidance/cg160/evidence/cg160-feverish-illness-in-children-full-guideline3",
				destination: "/guidance/cg160",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/public-involvement/putting-guidance-into-practice",
				destination:
					"/about/nice-communities/nice-and-the-public/public-involvement",
				permanent: true,
			},
			{
				source:
					"/guidance/cg42/evidence/full-guideline-including-appendices-17-195023341",
				destination: "/guidance/cg42",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/public-involvement/public-involvement-programme",
				destination:
					"/about/nice-communities/nice-and-the-public/public-involvement",
				permanent: true,
			},
			{
				source:
					"/guidance/qs16/resources/guidance-quality-standard-for-hip-fracture-pdf",
				destination: "/guidance/qs16",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/health-technologies-adoption-programme",
				destination:
					"/about/what-we-do/into-practice/health-technologies-adoption-team",
				permanent: true,
			},
			{
				source:
					"/Build%20any%20form%20with%20oForms/ResultsAdmin/ShowFormResults/:id",
				destination: "/oForms/ResultsAdmin/ShowFormResults/:id",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/measuring-the-impact-of-nice-guidance",
				destination:
					"/about/what-we-do/into-practice/measuring-the-uptake-of-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/guidance/cg77/resources/guidance-antisocial-personality-disorder-pdf",
				destination: "/guidance/cg77",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/savings-and-productivity-collection",
				destination:
					"/about/what-we-do/our-programmes/cost-savings-resource-planning",
				permanent: true,
			},
			{
				source:
					"/guidance/qs41/resources/guidance-familial-hypercholesterolaemia-pdf",
				destination: "/guidance/qs41",
				permanent: true,
			},
			{
				source:
					"/guidance/gid-cgwave0658/resources/macular-degeneration-final-scope2",
				destination: "/guidance/GID-CGWAVE0658/documents/draft-scope",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/research-and-development/research-recommendations",
				destination:
					"/about/what-we-do/science-policy-research/research-recommendations",
				permanent: true,
			},
			{
				source:
					"/guidance/conditions-and-diseases/cardiovascular-conditions/stroke",
				destination:
					"/guidance/conditions-and-diseases/cardiovascular-conditions/stroke-and-transient-ischaemic-attack",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/nice-syndication-api/apply-for-nice-syndication",
				destination: "/about/what-we-do/nice-syndication-api",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/accreditation/whats-happening-in-accreditation",
				destination: "/about/what-we-do/accreditation",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/public-involvement/develop-nice-guidance",
				destination:
					"/about/nice-communities/nice-and-the-public/public-involvement/support-for-vcs-organisations/help-us-develop-guidance/guides-to-developing-our-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/scientific-advice/nice-mhra-scientific-advice",
				destination:
					"/about/what-we-do/life-sciences/scientific-advice/nice-mhra-scientific-advice",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/scientific-advice/frequently-asked-questions",
				destination:
					"/about/what-we-do/life-sciences/scientific-advice/frequently-asked-questions",
				permanent: true,
			},
			{
				source: "/guidance/conditions-and-diseases/skin-conditions/skin-ulcers",
				destination:
					"/guidance/conditions-and-diseases/skin-conditions/pressure-ulcers",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-international/nice-international-team",
				destination: "/about/what-we-do/nice-international",
				permanent: true,
			},
			{
				source: "/guidance/ta65/resources/appendix-a-static-list-review-paper",
				destination:
					"/guidance/TA65/documents/appendix-a-static-list-review-paper2",
				permanent: true,
			},
			{
				source: "/about/who-we-are/senior-management-team/interests-register",
				destination:
					"/about/who-we-are/board-executive-team-and-senior-leaders-interests-register",
				permanent: true,
			},
			{
				source: "/About/What-we-do/International-services/knowledge-transfer",
				destination: "/about/what-we-do/nice-international",
				permanent: true,
			},
			{
				source: "/about/what-we-do/scientific-advice/light-scientific-advice",
				destination:
					"/about/what-we-do/life-sciences/scientific-advice/light-scientific-advice",
				permanent: true,
			},
			{
				source: "/media/5F2/44/The_guidelines_manual_2009_-_All_chapters.pdf",
				destination:
					"http://www.webarchive.org.uk/wayback/archive/20140616203342/http:/nice.org.uk/media/615/64/The_guidelines_manual_2009.pdf",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes/local-practice-collection",
				destination:
					"/about/what-we-do/into-practice/local-practice-case-studies",
				permanent: true,
			},
			{
				source: "/guidance/cg90/resources/guidance-depression-in-adults-pdf",
				destination: "/guidance/cg90",
				permanent: true,
			},
			{
				source: "/guidance/cg181/resources/patient-decision-aid-243780157",
				destination: "/guidance/cg181/resources/patient-decision-aid-243780159",
				permanent: true,
			},
			{
				source: "/guidance/cg137/resources/cg137-epilepsy-full-guideline3",
				destination: "/guidance/cg137",
				permanent: true,
			},
			{
				source: "/about/what-we-do/accreditation/accreditation-decisions",
				destination: "/about/what-we-do/accreditation",
				permanent: true,
			},
			{
				source: "/about/nice-communities/generalpractice/reference-panel",
				destination: "/forms/subscribe-to-our-gp-reference-panel",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/commissioning-support",
				destination:
					"/about/what-we-do/into-practice/resource-impact-assessment",
				permanent: true,
			},
			{
				source: "/guidance/cg9/resources/guidance-eating-disorders-pdf",
				destination: "/guidance/cg9",
				permanent: true,
			},
			{
				source: "/guidance/cg122/resources/guidance-ovarian-cancer-pdf",
				destination: "/guidance/cg122",
				permanent: true,
			},
			{
				source: "/about/nice-communities/public-involvement/your-care",
				destination:
					"/about/nice-communities/nice-and-the-public/making-decisions-about-your-care",
				permanent: true,
			},
			{
				source: "/guidance/cg62/resources/guidance-antenatal-care-pdf",
				destination: "/guidance/cg62",
				permanent: true,
			},
			{
				source: "/guidance/cg155-update-1/consultation/html-content-2",
				destination:
					"/guidance/cg155/update/cg155-update-1/consultation/html-content-2",
				permanent: true,
			},
			{
				source: "/about/what-we-do/evidence-services/evidence-search",
				destination:
					"/about/what-we-do/evidence-and-best-practice-resources/evidence-search/evidence-search-service-closure-information",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/into-practice-guide",
				destination:
					"/about/what-we-do/into-practice/resources-help-put-guidance-into-practice",
				permanent: true,
			},
			{
				source: "/guidance/cg150-update-1/consultation/html-content",
				destination:
					"/guidance/cg150/update/cg150-update-1/consultation/html-content",
				permanent: true,
			},
			{
				source: "/guidance/qs50/chapter/List-of-quality-statements",
				destination: "/guidance/qs50/chapter/Quality-statements",
				permanent: true,
			},
			{
				source: "/guidance/ng28/evidence/full-guideline-2185320349",
				destination: "/guidance/ng28",
				permanent: true,
			},
			{
				source: "/guidance/cg127/chapter/appendix-c-the-algorithms",
				destination: "/guidance/cg127",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes/topic-selection",
				destination: "/guidance/topic-selection",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work/get-in-touch",
				destination: "/about/what-we-do/our-research-work",
				permanent: true,
			},
			{
				source: "/guidance/cg191/resources/guidance-pneumonia-pdf",
				destination: "/guidance/cg191",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/forward-planner",
				destination: "/about/what-we-do/into-practice/resource-planner",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences/contact-us-form",
				destination: "/forms/life-sciences-contact-us",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-syndication-api/content",
				destination: "/about/what-we-do/nice-syndication-api",
				permanent: true,
			},
			{
				source: "/media/FA1/59/GuidelinesManualChapters2007.pdf",
				destination:
					"http://www.webarchive.org.uk/wayback/archive/20140616203343/http://nice.org.uk/media/60C/C6/2007_Clinical_guidelines_manual.pdf",
				permanent: true,
			},
			{
				source: "/about/who-we-are/board/interests-register",
				destination:
					"/about/who-we-are/board-executive-team-and-senior-leaders-interests-register",
				permanent: true,
			},
			{
				source: "/guidance/cg3/chapter/1-recommendations",
				destination: "/guidance/cg3",
				permanent: true,
			},
			{
				source: "/article/wg1/chapter/NICE-style-guide",
				destination: "/article/wg1",
				permanent: true,
			},
			{
				source: "/guidance/cg117/chapter/introduction",
				destination: "/guidance/cg117",
				permanent: true,
			},
			{
				source: "/guidance/cg67/chapter/section_1_1",
				destination: "/guidance/cg67",
				permanent: true,
			},
			{
				source: "/guidance/cg88/chapter/1-guidance",
				destination: "/guidance/cg88",
				permanent: true,
			},
			{
				source: "/guidance/cg27/chapter/1-guidance",
				destination: "/guidance/cg27",
				permanent: true,
			},
			{
				source: "/guidance/cg3/chapter/1-guidance",
				destination: "/guidance/cg3",
				permanent: true,
			},
			{
				source: "/guidance/cg144/chapter/guidance",
				destination: "/guidance/cg144",
				permanent: true,
			},
			{
				source: "/guidance/cg150/chapter/guidance",
				destination: "/guidance/cg150",
				permanent: true,
			},
			{
				source: "/article/wg1/chapter/r",
				destination: "/corporate/ecd1/chapter/1-using-this-guide",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/QOFIndicators/the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-who-have-been-screened-for-hazardous-drinking-using-the-fast-or-audit-c-tool-in-the-preceding-2-years",
				destination:
					"/Standards-and-Indicators/QOFIndicators/the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-who-have-been-screened-for-unsafe-drinking-using-the-fast-or-audit-c-tool-in-the-preceding-2-years",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-hypertension-in-the-preceding-12-months-who-have-been-screened-for-hazardous-drinking-using-the-fast-or-audit-c-tool-in-the-3-months-before-or-after-the-date-of-entry-on-the-hypertension-register",
				destination:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-hypertension-in-the-preceding-12-months-who-have-been-screened-for-unsafe-drinking-using-the-fast-or-audit-c-tool-in-the-3-months-before-or-after-the-date-of-entry-on-the-hypertension-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-depression-or-anxiety-in-the-preceding-12-months-who-have-been-screened-for-hazardous-drinking-using-the-fast-or-audit-c-tool-in-the-3-months-before-or-after-their-diagnosis-being-recorded",
				destination:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-depression-or-anxiety-in-the-preceding-12-months-who-have-been-screened-for-unsafe-drinking-using-the-fast-or-audit-c-tool-in-the-3-months-before-or-after-their-diagnosis-being-recorded",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/percentage-of-patients-on-the-learning-disability-register-with-down-s-syndrome-aged-18-and-over-who-have-a-record-of-blood-tsh-in-the-previous-15-months-excluding-those-who-are-on-the-thyroid-disease-register",
				destination:
					"/Standards-and-Indicators/GPQualityImprovements/percentage-of-patients-on-the-learning-disability-register-with-down-s-syndrome-aged-18-and-over-who-have-a-record-of-blood-tsh-in-the-previous-15-months-excluding-those-who-are-on-the-thyroid-disease-register",
				permanent: true,
			},
			{
				source:
					"/news/article/children-and-young-people-should-be-taught-simple-hygiene-measures-to-help-curb-the-spread-of-infections-says-nice",
				destination:
					"http://indepth.nice.org.uk/children-and-young-people-should-be-taught-simple-hygiene-measures-to-curb-the-spread-of-infections-says-nice/index.html",
				permanent: true,
			},
			{
				source:
					"/news/article/nice-guidelines-aim-to-improve-how-children-at-risk-of-abuse-or-neglect-are-helped-and-supported",
				destination:
					"https://indepth.nice.org.uk/nice-guidelines-aim-to-improve-how-children-at-risk-of-abuse-or-neglect-are-helped-and-supported/index.html",
				permanent: true,
			},
			{
				source:
					"/news/article/end-of-life-care-must-be-for-the-whole-family-not-just-the-dying-child-says-nice-in-new-guidance",
				destination:
					"http://indepth.nice.org.uk/end-of-life-care-must-support-the-whole-family-not-just-the-dying-child-says-nice-in-new-guidance/index.html",
				permanent: true,
			},
			{
				source:
					"/news/article/nice-guidance-on-end-of-life-care-for-children-aims-to-end-inconsistences-in-treatment",
				destination:
					"https://indepth.nice.org.uk/nice-guidance-on-end-of-life-care-for-children-aims-to-end-inconsistences-in-treatment/index.html",
				permanent: true,
			},
			{
				source:
					"/news/article/no-idling-zones-can-help-to-protect-vulnerable-people-from-air-pollution-says-nice",
				destination:
					"http://indepth.nice.org.uk/no-idle-zones-can-help-protect-vulnerable-people-from-air-pollution-says-nice/index.html",
				permanent: true,
			},
			{
				source:
					"/news/nice-newsletters-and-alerts/subscribe-to-medicines-and-prescribing-important-new-evidence",
				destination:
					"/forms/subscribe-to-medicines-and-prescribing-important-new-evidence",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/transforming-nice--delivering-more-relevant--timely-and-useable-guidance",
				destination: "http://indepth.nice.org.uk/transforming-nice/index.html",
				permanent: true,
			},
			{
				source:
					"/news/feature/nice-guidance-to-help-children-and-families-open-up-about-domestic-violence",
				destination:
					"https://indepth.nice.org.uk/nice-guidance-to-help-children-and-families-open-up-about-domestic-violence/index.html",
				permanent: true,
			},
			{
				source:
					"/news/nice-newsletters-and-alerts/subscribe-to-the-evidence-resources-library-bulletin",
				destination: "/what-we-do/evidence-services",
				permanent: true,
			},
			{
				source:
					"/guidance/indevelopment/gid-managementandorganisationalapproachestosafestaffing",
				destination: "/guidance/indevelopment/gid-sgwave0761",
				permanent: true,
			},
			{
				source:
					"/news/nice-newsletters-and-alerts/subscribe-to-medicine-and-prescribing-alerts",
				destination: "/forms/subscribe-to-medicine-and-prescribing-alerts",
				permanent: true,
			},
			{
				source:
					"/guidance/indevelopment/gid-atypicalhaemolyticuraemicsyndromeahuseculizumab",
				destination: "/guidance/hst1",
				permanent: true,
			},
			{
				source:
					"/news/article/join-the-nice-network-of-health-and-social-care-professionals",
				destination:
					"/news/article/join-the-nice-network-of-health-and-social-care-leaders",
				permanent: true,
			},
			{
				source:
					"/news/nice-newsletters-and-alerts/subscribe-to-nice-news-for-life-sciences",
				destination: "/forms/subscribe-to-nice-news-for-life-sciences",
				permanent: true,
			},
			{
				source:
					"/news/nice-newsletters-and-alerts/subscribe-to-chief-executives-update",
				destination: "/news/nice-newsletters-and-alerts",
				permanent: true,
			},
			{
				source:
					"/news/nice-newsletters-and-alerts/subscribe-to-update-for-primary-care",
				destination: "/forms/subscribe-to-update-for-primary-care",
				permanent: true,
			},
			{
				source:
					"/news/nice-newsletters-and-alerts/subscribe-to-nice-news-international",
				destination: "/forms/subscribe-to-nice-news-international",
				permanent: true,
			},
			{
				source:
					"/guidance/indevelopment/gid-safemidwiferystaffingformaternitysettings",
				destination: "/guidance/NG4",
				permanent: true,
			},
			{
				source:
					"/News/Article/take-a-patient-centered-approach-to-treating-cataracts",
				destination: "http://indepth.nice.org.uk/cataracts/index.html",
				permanent: true,
			},
			{
				source:
					"/news/article/responding-to-child-abuse-and-neglect-a-view-from-nice",
				destination:
					"http://indepth.nice.org.uk/responding-to-child-abuse-and-neglect-a-view-from-NICE/index.html",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/how-gps-help-develop-our-guidance",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source:
					"/get-involved/jobs/our-benefits--rewards-and-work-life-balance",
				destination:
					"/get-involved/careers/our-benefits--rewards-and-work-life-balance",
				permanent: true,
			},
			{
				source: "/news/article/nice-encourages-use-of-greener-asthma-inhalers",
				destination: "/guidance/ng80/resources/",
				permanent: true,
			},
			{
				source: "/get-involved/our-committees/what-professional-members-do",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-mentalhealthinpatientsettings",
				destination: "/guidance/indevelopment/gid-sgwave0701",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-mentalhealthcommunitysettings",
				destination: "/guidance/indevelopment/gid-sgwave0702",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-accidentandemergencysettings",
				destination: "/guidance/indevelopment/gid-sgwave0762",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-communitynursingcaresettings",
				destination: "/guidance/indevelopment/gid-sgwave0700",
				permanent: true,
			},
			{
				source: "/news/nice-newsletters-and-alerts/subscribe-to-nice-news",
				destination: "/forms/subscribe-to-nice-news-for-health-and-social-care",
				permanent: true,
			},
			{
				source: "/about/what-we-do/patient-access-schemes-liaison-unit",
				destination: "/about/what-we-do/commercial-liaison-team",
				permanent: true,
			},
			{
				source: "/get-involved/our-committees/what-lay-members-do",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source: "/usingguidance/donotdorecommendations/search.jsp",
				destination:
					"/savingsAndProductivity/collection?page=1&pageSize=2000&type=Do+not+do&published",
				permanent: true,
			},
			{
				source: "/about/what-we-do/real-world-evidence-framework",
				destination: "/corporate/ecd9/chapter/overview",
				permanent: true,
			},
			{
				source: "/usingguidance/donotdorecommendations/index.jsp",
				destination:
					"/savingsAndProductivity/collection?page=1&pageSize=2000&type=Do+not+do&published",
				permanent: true,
			},
			{
				source: "/news/article/nice-shared-learning-awards-2017",
				destination:
					"https://indepth.nice.org.uk/nice-shared-learning-awards-2017/index.html",
				permanent: true,
			},
			{
				source: "/about/nice-communities/general-practitioners",
				destination: "/about/nice-communities/generalpractice",
				permanent: true,
			},
			{
				source: "/get-involved/our-committees/join-a-committee",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source: "/guidance/settings-and-environment/care-homes",
				destination: "/guidance/settings/care-homes",
				permanent: true,
			},
			{
				source: "/news/blog/are-statins-the-best-choice-for-me",
				destination:
					"http://indepth.nice.org.uk/are-statins-the-best-choice-for-me/index.html",
				permanent: true,
			},
			{
				source: "/get-involved/fellows-and-scholars/scholars",
				destination:
					"/about/what-we-do/our-fellows-and-scholars-programmes-have-now-closed",
				permanent: true,
			},
			{
				source: "/about/nice-communities/public-involvement",
				destination: "/about/nice-communities/nice-and-the-public",
				permanent: true,
			},
			{
				source: "/about/what-we-do/research-and-development",
				destination: "/about/what-we-do/science-policy-research",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/we-care-about-our-staff",
				destination: "/get-involved/careers/we-care-about-our-staff",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/diversity-and-inclusion",
				destination: "/get-involved/careers/diversity-and-inclusion",
				permanent: true,
			},
			{
				source: "/nicemedia/pdf/cg016publicinfoenglish.pdf",
				destination: "/guidance/CG16/informationforpublic",
				permanent: true,
			},
			{
				source: "/about/what-we-do/international-services",
				destination: "/about/what-we-do/nice-international",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-scwave0708",
				destination: "/guidance/NG76",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-cgwave0643",
				destination: "/guidance/ng37",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-cgwave0676",
				destination: "/guidance/NG5",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-cgwaver107",
				destination: "/guidance/NG3",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-cgwave0600",
				destination: "/guidance/NG2",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-cgwave0599",
				destination: "/guidance/NG1",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-cgwave0639",
				destination: "/guidance/ng23",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-cgwave0694",
				destination: "/guidance/ng31",
				permanent: true,
			},
			{
				source: "/Media%20Library/ClientStorage/Index",
				destination: "/Orchard.MediaLibrary/ClientStorage/Index",
				permanent: true,
			},
			{
				source: "/about/what-we-do/scientific-advice",
				destination: "/about/what-we-do/life-sciences/scientific-advice",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-tag480/",
				destination:
					"/guidance/indevelopment/gid-mucopolysaccharidosiselosulfasealfaid744",
				permanent: true,
			},
			{
				source: "/news/article/sepsis-what-nice-says",
				destination:
					"http://indepth.nice.org.uk/sepsis-what-nice-says/index.html",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/digital-at-nice",
				destination: "/get-involved/careers/digital-at-nice",
				permanent: true,
			},
			{
				source: "/guidance/indevelopment/gid-phg70",
				destination: "/guidance/NG6",
				permanent: true,
			},
			{
				source: "/about/who-we-are/nice-connect",
				destination:
					"/about/who-we-are/corporate-publications/the-nice-strategy-2021-to-2026",
				permanent: true,
			},
			{
				source: "/News/Article/20-years-of-nice",
				destination: "http://indepth.nice.org.uk/20-years-of-NICE/index.html",
				permanent: true,
			},
			{
				source: "/about/who-we-are/our-vision",
				destination: "/about/who-we-are",
				permanent: true,
			},
			{
				source: "/nicemedia/pdf/CG72QRG.pdf",
				destination: "/guidance/cg72",
				permanent: true,
			},
			{
				source: "/guidance/cg026/resources",
				destination: "/guidance/cg26/resources",
				permanent: true,
			},
			{
				source: "/nicemedia/pdf/proton.pdf",
				destination: "/guidance/cg184",
				permanent: true,
			},
			{
				source:
					"/aac/identifying-high-potential-products-and-accelerating-access-to-market",
				destination: "/aac",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/developing-nice-quality-standards",
				destination: "/standards-and-indicators/get-involved",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/quality-standards-topic-library",
				destination:
					"/standards-and-indicators/selecting-and-prioritising-quality-standard-topics",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/quality-standard-consultations",
				destination:
					"/standards-and-indicators/get-involved/quality-standard-consultations",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/support-a-quality-standard",
				destination:
					"/standards-and-indicators/get-involved/support-a-quality-standard",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/how-we-develop-ccg-ois",
				destination:
					"/media/default/Get-involved/Meetings-In-Public/indicator-advisory-committee/ioc-process-guide.pdf",
				permanent: true,
			},
			{
				source: "/re-using-our-content/uk-open-content-licence",
				destination: "/forms/use-of-nice-content-in-the-uk",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/how-we-develop-qof",
				destination:
					"/media/default/Get-involved/Meetings-In-Public/indicator-advisory-committee/ioc-process-guide.pdf",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/topic-engagement",
				destination: "/standards-and-indicators/get-involved/topic-engagement",
				permanent: true,
			},
			{
				source: "/guidance/settings-and-environment",
				destination: "/guidance/settings",
				permanent: true,
			},
			{
				source: "/Get-Involved/join-a-committee",
				destination: "/Get-Involved/our-committees",
				permanent: true,
			},
			{
				source: "/get-involved/citizens-council",
				destination: "/get-involved",
				permanent: true,
			},
			{
				source: "/news/press-release-archive",
				destination: "/news/press-and-media",
				permanent: true,
			},
			{
				source: "/get-involved/nice-listens",
				destination: "/about/what-we-do/our-research-work/nice-listens",
				permanent: true,
			},
			{
				source: "/localPractice/collection",
				destination:
					"/about/what-we-do/into-practice/shared-learning-case-studies",
				permanent: true,
			},
			{
				source: "/NICE-Pathways/feedback",
				destination: "/NICE-Pathways-feedback",
				permanent: true,
			},
			{
				source: "/get-involved/scholars",
				destination:
					"/about/what-we-do/our-fellows-and-scholars-programmes-have-now-closed",
				permanent: true,
			},
			{
				source: "/get-involved/fellows",
				destination:
					"/about/what-we-do/our-fellows-and-scholars-programmes-have-now-closed",
				permanent: true,
			},
			{
				source: "/get-involved/tenders",
				destination:
					"/freedom-of-information/freedom-of-information-publication-scheme",
				permanent: true,
			},
			{
				source: "/guidance/csgbraincns",
				destination: "/guidance/csg10",
				permanent: true,
			},
			{
				source: "/news/nice-statistics",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/summary-of-decisions",
				permanent: true,
			},
			{
				source: "/guidance/csgsarcoma",
				destination: "/guidance/csg9",
				permanent: true,
			},
			{
				source: "/get-involved/jobs",
				destination: "/get-involved/careers",
				permanent: true,
			},
			{
				source: "/guidance/csgstim",
				destination: "/guidance/csg8",
				permanent: true,
			},
			{
				source: "/guidance/psg002",
				destination: "/guidance/psg2",
				permanent: true,
			},
			{
				source: "/guidance/psg001",
				destination: "/guidance/psg1",
				permanent: true,
			},
			{
				source: "/guidance/csgcyp",
				destination: "/guidance/csg7",
				permanent: true,
			},
			{
				source: "/guidance/cg063",
				destination: "/guidance/cg63",
				permanent: true,
			},
			{
				source: "/guidance/cg027",
				destination: "/guidance/cg27",
				permanent: true,
			},
			{
				source: "/guidance/cg026",
				destination: "/guidance/cg26",
				permanent: true,
			},
			{
				source: "/guidance/csgbc",
				destination: "/guidance/csg1",
				permanent: true,
			},
			{
				source: "/guidance/csguc",
				destination: "/guidance/csg2",
				permanent: true,
			},
			{
				source: "/guidance/csgho",
				destination: "/guidance/csg3",
				permanent: true,
			},
			{
				source: "/guidance/csgsp",
				destination: "/guidance/csg4",
				permanent: true,
			},
			{
				source: "/guidance/csgcc",
				destination: "/guidance/csg5",
				permanent: true,
			},
			{
				source: "/guidance/csghn",
				destination: "/guidance/csg6",
				permanent: true,
			},
			{
				source: "/article/pmg26",
				destination:
					"/guidance/ng18/informationforpublic/type-1-diabetes-in-children-and-young-people",
				permanent: true,
			},
			{
				source: "/article/pmg27",
				destination:
					"/guidance/ng18/informationforpublic/type-2-diabetes-in-children-and-young-people",
				permanent: true,
			},
			{
				source: "/advice/es41-",
				destination: "/advice/es41",
				permanent: true,
			},
			{
				source: "/news/events",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/guidance/76",
				destination: "/guidance/NG76",
				permanent: true,
			},
			{
				source: "/guidance/a",
				destination: "/guidance/cg48",
				permanent: true,
			},
			{
				source: "/guidance/b",
				destination: "/guidance/cg29",
				permanent: true,
			},
			{
				source: "/guidance/c",
				destination: "/guidance/cg55",
				permanent: true,
			},
			{
				source: "/guidance/d",
				destination: "/guidance/cg70",
				permanent: true,
			},
			{
				source: "/guidance/e",
				destination: "/guidance/cg66",
				permanent: true,
			},
			{
				source: "/guidance/f",
				destination: "/guidance/cg66",
				permanent: true,
			},
			{
				source: "/guidance/g",
				destination: "/guidance/cg66",
				permanent: true,
			},
			{
				source: "/aac/about",
				destination: "/aac",
				permanent: true,
			},
			{
				source: "/terms-and-conditions%20-%20notice-of-rights",
				destination: "/terms-and-conditions#notice-of-rights",
				permanent: true,
			},
			{
				source: "/social-care-quality-improvement-resource",
				destination:
					"/about/nice-communities/social-care/quality-improvement-resource",
				permanent: true,
			},
			{
				source: "/antimicrobial-prescribing-guidelines",
				destination:
					"/guidance/health-protection/communicable-diseases/antimicrobial-stewardship",
				permanent: true,
			},
			{
				source: "/child-abuse-neglect-consultation",
				destination:
					"/guidance/indevelopment/gid-scwave0708/consultation/html-content-2",
				permanent: true,
			},
			{
				source: "/digital-evidence-standards",
				destination:
					"/about/what-we-do/our-programmes/evidence-standards-framework-for-digital-health-technologies",
				permanent: true,
			},
			{
				source: "/maintaining-our-guidelines",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/maintaining-and-updating-our-guideline-portfolio",
				permanent: true,
			},
			{
				source: "/office-for-market-access",
				destination: "/about/what-we-do/life-sciences/office-for-market-access",
				permanent: true,
			},
			{
				source: "/into-practice-resources",
				destination:
					"/about/what-we-do/into-practice/resources-help-put-guidance-into-practice",
				permanent: true,
			},
			{
				source: "/plan-prioritise-monitor",
				destination: "/about/what-we-do/into-practice",
				permanent: true,
			},
			{
				source: "/shared-decision-making",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/shared-decision-making",
				permanent: true,
			},
			{
				source: "/executive-recruitment",
				destination: "/get-involved/jobs/executive-recruitment",
				permanent: true,
			},
			{
				source: "/health-inequalities",
				destination: "/about/what-we-do/nice-and-health-inequalities",
				permanent: true,
			},
			{
				source: "/nice-international",
				destination: "/about/what-we-do/nice-international",
				permanent: true,
			},
			{
				source: "/scientific-advice",
				destination: "/about/what-we-do/life-sciences/scientific-advice",
				permanent: true,
			},
			{
				source: "/topic-page-survey",
				destination:
					"https://insights.hotjar.com/s?siteId=119167&surveyId=74303",
				permanent: true,
			},
			{
				source: "/transforming-nice",
				destination: "http://indepth.nice.org.uk/transforming-nice/index.html",
				permanent: true,
			},
			{
				source: "/bnf-bnfc-uk-only",
				destination: "/bnf-uk-only",
				permanent: true,
			},
			{
				source: "/measuring-uptake",
				destination:
					"/About/What-we-do/Into-practice/Measuring-the-uptake-of-NICE-guidance",
				permanent: true,
			},
			{
				source: "/resource-impact",
				destination:
					"/About/What-we-do/Into-practice/resource-impact-assessment",
				permanent: true,
			},
			{
				source: "/greenlight-xps",
				destination:
					"/guidance/mtg29/resources/nice-medical-technology-adoption-support-for-the-greenlight-xps-laser-system-for-treating-benign-prostatic-hyperplasia-insights-from-the-nhs-2603460493/chapter/1-Introduction",
				permanent: true,
			},
			{
				source: "/methods-review",
				destination: "https://indepth.nice.org.uk/methods-review/index.html",
				permanent: true,
			},
			{
				source: "/resourceimpact",
				destination:
					"/about/what-we-do/into-practice/resource-impact-assessment",
				permanent: true,
			},
			{
				source: "/aboutguidance",
				destination: "/about/what-we-do/our-programmes/nice-guidance",
				permanent: true,
			},
			{
				source: "/adoption-team",
				destination:
					"/about/what-we-do/into-practice/health-technologies-adoption-team",
				permanent: true,
			},
			{
				source: "/life-sciences",
				destination: "/about/what-we-do/life-sciences",
				permanent: true,
			},
			{
				source: "/virtual-wards",
				destination:
					"/about/what-we-do/supporting-the-health-and-care-system-to-implement-virtual-wards",
				permanent: true,
			},
			{
				source: "/cks-feedback",
				destination: "/leave-feedback",
				permanent: true,
			},
			{
				source: "/digital-jobs",
				destination: "/get-involved/jobs/digital",
				permanent: true,
			},
			{
				source: "/quick-guides",
				destination: "/about/nice-communities/social-care/quick-guides",
				permanent: true,
			},
			{
				source: "/roi-feedback",
				destination:
					"/about/what-we-do/into-practice/return-on-investment-tools/feedback",
				permanent: true,
			},
			{
				source: "/coronavirus",
				destination:
					"/guidance/conditions-and-diseases/respiratory-conditions/covid19",
				permanent: true,
			},
			{
				source: "/endorsement",
				destination: "/about/what-we-do/into-practice/endorsement",
				permanent: true,
			},
			{
				source: "/newhomepage",
				destination: "/",
				permanent: true,
			},
			{
				source: "/newsletters",
				destination: "/news/nice-newsletters-and-alerts",
				permanent: true,
			},
			{
				source: "/social-care",
				destination: "/about/nice-communities/social-care",
				permanent: true,
			},
			{
				source: "/associates",
				destination:
					"/about/nice-communities/medicines-and-prescribing/nice-medicines-and-prescribing-associates",
				permanent: true,
			},
			{
				source: "/compliance",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/achieving-and-demonstrating-compliance",
				permanent: true,
			},
			{
				source: "/niceadvice",
				destination: "/about/what-we-do/life-sciences/nice-advice-service",
				permanent: true,
			},
			{
				source: "/nice-at-25",
				destination: "https://indepth.nice.org.uk/NICE-at-25/index.html",
				permanent: true,
			},
			{
				source: "/terms-and-",
				destination: "/terms-and-conditions",
				permanent: true,
			},
			{
				source: "/covid-19",
				destination:
					"/guidance/conditions-and-diseases/respiratory-conditions/covid19",
				permanent: true,
			},
			{
				source: "/research",
				destination: "/about/what-we-do/our-research-work",
				permanent: true,
			},
			{
				source: "/strategy",
				destination:
					"/about/who-we-are/corporate-publications/the-nice-strategy-2021-to-2026",
				permanent: true,
			},
			{
				source: "/bursary",
				destination:
					"/about/nice-communities/public-involvement/bursary-scheme-for-nice-annual-conference",
				permanent: true,
			},
			{
				source: "/connect",
				destination:
					"/about/who-we-are/corporate-publications/the-nice-strategy-2021-to-2026",
				permanent: true,
			},
			{
				source: "/uptake",
				destination:
					"/about/what-we-do/into-practice/measuring-the-uptake-of-nice-guidance/uptake-data",
				permanent: true,
			},
			{
				source: "/brand",
				destination: "https://indepth.nice.org.uk/our-brand/index.html",
				permanent: true,
			},
			{
				source: "/tahst",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/consultation-on-changes-to-technology-appraisals-and-highly-specialised-technologies",
				permanent: true,
			},
			{
				source: "/mtep",
				destination:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-medical-technologies-guidance",
				permanent: true,
			},
			{
				source: "/tom6",
				destination: "/guidance",
				permanent: true,
			},
			{
				source: "/aac",
				destination: "https://www.england.nhs.uk/aac/about-us/who-we-are/",
				permanent: true,
			},
			{
				source: "/csp",
				destination:
					"/about/what-we-do/our-programmes/commissioning-support-programme",
				permanent: true,
			},
			{
				source: "/oma",
				destination: "/about/what-we-do/office-for-market-access",
				permanent: true,
			},
			{
				source: "/sdm",
				destination:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/shared-decision-making",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/costs--charging-for-technology-appraisals-and-highly-specialised-technologies/technology-appraisals-and-highly-specialised-technologies-charging-timeline",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/support-for-vcs-organisations/help-us-develop-guidance/guides-to-developing-our-guidance",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-a-voluntary-and-community-sector-organisation/contributing-to-the-development-of-our-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/technology-appraisal-submission-templates-and-supporting-documents",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-submission-templates-and-supporting-documents",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/improving-young-people-s-experiences-in-transition-to-and-from-inpatient-mental-health-settings",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/provider-information/core-standards--non-agents",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/overview-how-we-develop-about-technology-appraisal-guidance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/how-we-develop-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/chemotherapy-dose-standardisation-nice-position-statement",
				destination:
					"/position-statements/chemotherapy-dose-standardisation-nice-position-statement",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/organisations-eligible-to-use-the-framework",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/provider-information/core-standards--agents",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/promoting-wellbeing-and-positive-identity-for-a-child-or-young-person-who-is-looked-after",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-dementia-with-the-contact-details-of-a-named-carer-on-their-record",
				destination: "/indicators/IND114-dementia-named-carer",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/provider-information/sole-supplied-titles",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/sole-supplied-titles",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/arranging-services-for-people-with-a-learning-disability-and-behaviour-that-challenges",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/supporting-people-who-provide-unpaid-care-for-adults-with-health-or-social-care-needs",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/modular-updates-for-technology-appraisals-guidance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/modular-updates-for-our-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/purchasing-steps--further-competition",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/purchasing-steps-further-competition",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-cvd-who-are-currently-treated-with-a-lipid-lowering-therapy",
				destination:
					"/indicators/IND230-cardiovascular-disease-prevention-secondary-prevention-with-lipid-lowering-therapies",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/biosimilar-technologies-nice-position-statement",
				destination:
					"/position-statements/biosimilar-technologies-nice-position-statement",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/planning-your-technology-appraisal-submission-to-nice",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/planning-your-technology-appraisal-submission-to-nice",
				permanent: true,
			},
			{
				source:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration--guidelines--quality-standards-and-indicators",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration-guidelines-quality-standards-and-indicators",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/changes-to-health-technology-evaluation",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/purchasing-steps--direct-awards",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/purchasing-steps-direct-awards",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/achieving-and-demonstrating-compliance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/compliance-with-nice-approved-medicine-or-treatment",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books-journals-and-databases/purchasing-steps--direct-awards",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/purchasing-steps-direct-awards",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/data/cancer-appraisal-recommendations",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-data-cancer-appraisal-recommendations",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/helping-to-prevent-winter-deaths-and-illnesses-associated-with-cold-homes",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/uk-licensing-and-technology-appraisals",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/uk-licensing-and-technology-appraisals",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/what-lay-members-do/lay-member-payments-and-expenses/how-lay-member-payments-affect-benefits",
				destination:
					"/get-involved/our-committees/your-role-as-a-nice-committee-member",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/data/appraisal-recommendations",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-data-appraisal-recommendations",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/support-for-vcs-organisations/help-us-develop-guidance",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-a-voluntary-and-community-sector-organisation/how-voluntary-and-community-sector-organisations-can-help-us-develop-guidance",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/NICE-medical-technologies/MTEP-expert-adviser-questionnaire.docx",
				destination: "/what-nice-does/our-guidance/about-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/charging/procedure-tahst",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/charging-for-technology-appraisals-and-highly-specialised-technologies/charging-procedure-technology-appraisal-and-highly-specialised-technologies-evaluations",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/what-we-do/NICE-guidance/technology-appraisal-guidance/ta-hst-charging-process.pdf",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/charging-for-technology-appraisals-and-highly-specialised-technologies/charging-procedure-technology-appraisal-and-highly-specialised-technologies-evaluations",
				permanent: true,
			},
			{
				source:
					"/Media/Default/about/what-we-do/nice-guidance/nice-medical-technologies/MTEP-notification-form.docx",
				destination: "/what-nice-does/our-guidance/about-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/process/sta-timeline",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/technology-appraisal-processes-and-timelines/single-technology-appraisal-timeline",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/consultation-on-changes-to-technology-appraisals-and-highly-specialised-technologies",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/abbreviated-technology-appraisal-process-consultation",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/public-involvement-programme/patient-public-involvement-policy",
				destination:
					"/get-involved/people-and-communities/patient-and-public-involvement-policy",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/achieving-and-demonstrating-compliance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/achieving-and-demonstrating-compliance-with-nice-ta-and-hst-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/uk-licensing-and-technology-appraisals",
				destination:
					"/what-nice-does/our-guidance/Prioritising-our-guidance-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/maintaining-and-updating-our-guideline-portfolio",
				destination:
					"/what-nice-does/our-guidance/Prioritising-our-guidance-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/summary-of-decisions",
				destination: "/news",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers--september-2024",
				destination:
					"/about-us/our-board/public-board-meetings/2024/public-board-meetings-agenda-and-papers-september-2024",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/process/mta-timeline",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/technology-appraisal-processes-and-timelines/multiple-technology-appraisal-process-timeline",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers-september-2023",
				destination:
					"/about-us/our-board/public-board-meetings/2023/public-board-meeting-agenda-and-papers-september-2023",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers-december-2023",
				destination:
					"/about-us/our-board/public-board-meetings/2023/public-board-meeting-agenda-and-papers-december-2023",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/recognising-and-responding-to-domestic-violence-and-abuse",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/models-for-the-evaluation-and-purchase-of-antimicrobials",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/a-new-model-for-evaluating-and-purchasing-antimicrobials-in-the-uk",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/dementia-discussing-and-planning-support-after-diagnosis",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/nice-voluntary-and-community-sector-forum",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-a-voluntary-and-community-sector-organisation/nice-voluntary-and-community-sector-forum",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/public-involvement-programme-expert-panel",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-someone-with-lived-experience/join-our-people-and-communities-network",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers--july-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-july-2022",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers--july-2023",
				destination:
					"/about-us/our-board/public-board-meetings/2023/public-board-meeting-agenda-and-papers-july-2023",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers--july-2024",
				destination:
					"/about-us/our-board/public-board-meetings/2024/public-board-meeting-agenda-and-papers-july-2024",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/process/sta-timeline",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/technology-appraisal-processes-and-timelines/single-technology-appraisal-timeline",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/building-independence-through-planning-for-transition",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/moving-between-hospital-and-home-including-care-homes",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/medical-technologies-guidance/register-as-a-stakeholder",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration-medical-technologies",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/promoting-positive-mental-wellbeing-for-older-people",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/making-decisions-using-nice-guidelines",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/making-decisions-using-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/cancer-drugs-fund",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/media/default/Get-involved/Meetings-In-Public/indicator-advisory-committee/ioc-process-guide.pdf",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source:
					"/Media/Default/About/Who-we-are/Policies-and-procedures/FOI-policy-and-complaints-procedure.docx",
				destination: "/freedom-of-information",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/what-to-expect-during-assessment-and-care-planning",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/assessment-and-diagnosis-of-autism-what-to-expect",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/digital-health/multi-agency-advisory-service-for-ai-and-data-driven-technologies",
				destination:
					"/what-nice-does/digital-health/artificial-intelligence-ai-and-digital-regulations-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/openathens-registration-help",
				destination:
					"/library-and-knowledge-services/openathens/openathens-registration-help",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/board/public-board-meetings/public-board-meeting-agenda-and-papers--january-2022",
				destination: "/about-us/our-board/public-board-meetings/2022",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/interventional-procedures-guidance/recommendations",
				destination:
					"/what-nice-does/our-guidance/types-of-recommendation-nice-can-make",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/evidence-for-strengths-and-asset-based-outcomes",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/charging",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/fees-for-technology-appraisals-and-highly-specialised-technologies",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/board/public-board-meetings/public-board-meeting-agenda-and-papers--march-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-march-2022",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/improving-oral-health-for-adults-in-care-homes",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-medical-technologies-guidance/get-involved",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/get-involved-with-medical-technologies-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/implementing-nice-guidance",
				destination: "/implementing-nice-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice",
				destination: "/implementing-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Highly-Specialised-Technologies-Evaluation-Committee/Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/highly-specialised-technologies-evaluation-committee/highly-specialised-technologies-evaluation-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books-journals-and-databases",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/our-role-in-the-innovative-licensing-and-access-pathway--ilap",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/our-role-in-the-innovative-licensing-and-access-pathway-ilap",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/evidence-standards-framework-for-digital-health-technologies",
				destination:
					"/what-nice-does/digital-health/evidence-standards-framework-esf-for-digital-health-technologies",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/how-we-develop-nice-guidelines",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/how-we-develop-nice-guidelines",
				permanent: true,
			},
			//TODO fix broken source "/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/data",
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/notify",
				destination:
					"/what-nice-does/our-guidance/about-interventional-procedures-guidance/notify-an-interventional-procedure",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-medical-technologies-evaluation-programme",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/get-a-medical-technology-evaluated",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-research-work/use-of-ai-in-evidence-generation--nice-position-statement",
				destination:
					"/position-statements/use-of-AI-in-evidence-generation-NICE-position-statement",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-highly-specialised-technologies-guidance",
				destination:
					"/what-nice-does/our-guidance/about-highly-specialised-technologies-guidance",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/support-for-vcs-organisations",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-a-voluntary-and-community-sector-organisation",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/effective-record-keeping-ordering-medicines",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/enabling-positive-lives-for-autistic-adults",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/openathens-eligibility",
				destination:
					"/library-and-knowledge-services/openathens/openathens-eligibility",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/data",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/eq-5d-5l",
				destination: "/what-nice-does/our-guidance/about-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/shared-decision-making",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/types-of-guideline",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/how-we-develop-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-and-best-practice-resources/evidence-search/evidence-search-service-closure-information",
				destination: "/library-and-knowledge-services",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/nice-advice-service/models-for-the-evaluation-and-purchase-of-antimicrobials",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/office-for-market-access/identify-the-most-appropriate-routes-to-nhs-access",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/office-for-market-access/changing-healthcare-landscape-and-your-technology",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/bursary-scheme-for-nice-annual-conference",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/patient-and-public-involvement-policy",
				destination:
					"/get-involved/people-and-communities/patient-and-public-involvement-policy",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-medical-technologies-guidance#static-list",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/european-early-dialogues-scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/office-for-market-access/early-access-to-medicines-scheme",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/office-for-market-access/safe-harbour-engagement-meetings",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/office-for-market-access/exploring-your-value-proposition",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/nice-advice-service/early-access-to-medicines-scheme",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-diagnostics-guidance#static-list",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/hdas-closure-information",
				destination: "/library-and-knowledge-services",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/local-practice-case-studies/shared-learning-awards",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-technology-appraisal-guidance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/measuring-the-uptake-of-nice-guidance/uptake-data",
				destination:
					"/implementing-nice-guidance/measuring-the-use-of-NICE-guidance",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-medical-technologies-guidance",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/set-scientific-advice-process",
				destination: "/about/what-we-do/life-sciences/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/nice-mhra-scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/frequently-asked-questions",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/types-of-nice-recommendation",
				destination: "/what-nice-does/our-guidance/types-of-recommendation",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/express-scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/light-scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/scientific-advice/education-and-training",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service/educational-webinars-and-masterclasses",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-Advice/Key-therapeutic-topics",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/return-on-investment-tools/feedback",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/mapping-nice-guidelines-to-the-care-quality-commission-s-single-assessment-framework[L,R=301,NC]",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/quality-standards-advisory-committee/quality-standards-advisory-committee-members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/quality-standards-advisory-committee/quality-standards-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/evidence-standards-framework-for-digital-health-technologies",
				destination:
					"/what-nice-does/digital-health/ evidence-standards-framework-esf-for-digital-health-technologies",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/medicines-and-prescribing/nice-medicines-and-prescribing-associates",
				destination:
					"/implementing-nice-guidance/implementation-help-and-advice/nice-medicines-and-prescribing-associates",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/public-involvement/bursary-scheme-for-nice-annual-conference",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/guidance/health-protection/communicable-diseases/antimicrobial-stewardship#summary",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/making-decisions-about-your-care",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/our-endorsement-programme-has-now-closed",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/process",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/methods-and-processes-used-before-2022",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/openathens-support",
				destination:
					"/library-and-knowledge-services/openathens/openathens-support",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-about-medical-technologies-guidance",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-about-technology-appraisal-guidance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/making-a-positive-impact",
				destination:
					"/get-involved/people-and-communities/making-a-positive-impact-people-and-communities-network-case-studies",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/good-practice-in-safeguarding-training",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/modern-slavery-and-human-trafficking-statement",
				destination:
					"/about-us/policies-procedures-and-reports/modern-slavery-and-human-trafficking-statement",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-interventional-procedures-guidance",
				destination:
					"/what-nice-does/our-guidance/about-interventional-procedures-guidance",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Highly-Specialised-Technologies-Evaluation-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/highly-specialised-technologies-evaluation-committee",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Interventional-Procedures-Advisory-Committee/Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/interventional-procedures-advisory-committee/interventional-procedures-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines/shared-decision-making",
				destination:
					"/what-nice-does/our-guidance/about-nice-guidelines/about-shared-decision-making",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/recognising-and-preventing-delirium",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/appraisal-methodology-for-records-1999-2013",
				destination:
					"/about-us/policies-procedures-and-reports/appraisal-methodology-for-records-1999-2013",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-appraisal-Committee/Committee-A-Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees/tac-a-members",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-appraisal-Committee/Committee-B-Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees/tac-b-members",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-appraisal-Committee/Committee-C-Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees/tac-c-members",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-appraisal-Committee/Committee-D-Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees/tac-d-members",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/helping-to-prevent-pressure-ulcers",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-and-papers-march-2024",
				destination: "/about-us/our-board/public-board-meetings/2024",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-september-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-september-2022",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/better-home-care-for-older-people",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/supporting-the-health-and-care-system-to-implement-virtual-wards",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/supporting-the-health-care-system-to-implement-virtual-wards",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-december-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-december-2022",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-december-2024",
				destination:
					"/about-us/our-board/public-board-meetings/2024/public-board-meeting-agenda-and-papers-december-2024",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/what-lay-members-do/lay-member-payments-and-expenses",
				destination:
					"/get-involved/our-committees/your-role-as-a-nice-committee-member",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Medical-Technologies-Advisory-Committee/Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/medical-technologies-advisory-committee/medical-technologies-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/creating-a-safeguarding-culture",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/understanding-intermediate-care",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/using-nice-guidance-principal-social-workers",
				destination:
					"/implementing-nice-guidance/social-care/using-nice-guidance-in-social-work-scenarios/families-and-relationships-settings/developing-relationships-with-parents",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/getting-help-to-overcome-abuse",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/person-centred-future-planning",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/prioritising-our-guidance-topics/our-prioritisation-decisions",
				destination:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-march-2023",
				destination: "/about-us/our-board/public-board-meetings/2023",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-march-2025",
				destination: "/about-us/our-board/public-board-meetings/2025",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/join-a-committee/how-to-apply-to-join-a-committee",
				destination:
					"/get-involved/our-committees/your-role-as-a-nice-committee-member",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Interventional-Procedures-Advisory-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/interventional-procedures-advisory-committee",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/helping-to-prevent-infection",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/indicator-advisory-committee-iac/iac-members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/indicator-advisory-committee/indicator-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-may-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-may-2022",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-may-2023",
				destination:
					"/about-us/our-board/public-board-meetings/2023/public-board-meeting-agenda-and-papers-may-2023",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-may-2024",
				destination:
					"/about-us/our-board/public-board-meetings/2024/public-board-meeting-agenda-and-papers-may-2024",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/involving-you",
				destination:
					"/get-involved/people-and-communities/involving-you-in-the-development-of-our-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/access",
				destination:
					"/library-and-knowledge-services/openathens/openathens-access",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/board-executive-team-and-senior-leaders-interests-register",
				destination:
					"/about-us/our-board/board-executive-team-and-senior-leaders-interests-register",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/selecting-and-prioritising-quality-standard-topics",
				destination:
					"/what-nice-does/standards-and-indicators/quality-standards/selecting-and-prioritising-quality-standard-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/types-of-nice-recommendation",
				destination:
					"/what-nice-does/our-guidance/types-of-recommendation-nice-can-make",
				permanent: true,
			},
			{
				source:
					"/get-involved/study-nice-and-lse-s-executive-msc-healthcare-decision-making",
				destination:
					"/get-involved/nice-training-and-development-opportunities/study-nice-and-lse-s-executive-msc-healthcare-decision-making",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/giving-medicines-covertly",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/resources-help-put-guidance-into-practice",
				destination: "/implementing-nice-guidance/into-practice-resources",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-advice/medtech-innovation-briefings",
				destination:
					"/implementing-nice-guidance/implementation-help-and-advice/helping-you-put-our-guidance-into-practice",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/trade-union-facility-time-report",
				destination:
					"/about-us/policies-procedures-and-reports/trade-union-facility-time-report",
				permanent: true,
			},
			{
				source:
					"/get-involved/register-as-a-stakeholder/who-can-register-as-a-stakeholder",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/who-can-register-as-a-stakeholder",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-diagnostics-guidance",
				destination: "/what-nice-does/our-guidance/about-diagnostics-guidance",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Medical-Technologies-Advisory-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/medical-technologies-advisory-committee",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Diagnostics-Advisory-Committee/Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/diagnostics-advisory-committee/diagnostics-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/the-nice-strategy-2021-to-2026",
				destination:
					"/about-us/corporate-publications/nice-transformation-plan",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/measuring-the-uptake-of-nice-guidance",
				destination:
					"/implementing-nice-guidance/measuring-the-use-of-NICE-guidance",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Into-practice/Measuring-the-uptake-of-NICE-guidance",
				destination:
					"/about/what-we-do/into-practice/resource-impact-assessment",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/science-policy-research/research-recommendations",
				destination: "/what-nice-does/our-research-work",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/health-technologies-adoption-team",
				destination:
					"/implementing-nice-guidance/implementation-help-and-advice/adoption-and-implementation-support",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/commissioning-support-programme",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quality-improvement-resource",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/cost-savings-resource-planning",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/resource-planner",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement",
				destination: "/get-involved/people-and-communities",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/shared-learning-case-studies",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/local-practice-case-studies",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/resource-impact-assessment",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/assessing-the-resource-impact-of-nice-guidance",
				permanent: true,
			},
			{
				source: "/About/What-we-do/Into-practice/resource-impact-assessment",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/assessing-the-resource-impact-of-nice-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences/office-for-market-access",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences/nice-advice-service",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences/scientific-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/resource-planner",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/resource-planner",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work/nice-listens",
				destination: "/what-nice-does/our-research-work/nice-listens",
				permanent: true,
			},
			{
				source: "/about/nice-communities/social-care/quick-guides",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes/managed-access",
				destination: "/what-nice-does/managed-access",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes/nice-guidance",
				destination: "/what-nice-does/our-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/adoption-team",
				destination:
					"/implementing-nice-guidance/implementation-help-and-advice/adoption-and-implementation-support",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes/nice-advice",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/endorsement",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/QOFIndicators/the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-who-have-been-screened-for-unsafe-drinking-using-the-fast-or-audit-c-tool-in-the-preceding-2-years",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-hypertension-in-the-preceding-12-months-who-have-been-screened-for-unsafe-drinking-using-the-fast-or-audit-c-tool-in-the-3-months-before-or-after-the-date-of-entry-on-the-hypertension-register",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-a-new-diagnosis-of-depression-or-anxiety-in-the-preceding-12-months-who-have-been-screened-for-unsafe-drinking-using-the-fast-or-audit-c-tool-in-the-3-months-before-or-after-their-diagnosis-being-recorded",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source:
					"/Standards-and-Indicators/GPQualityImprovements/percentage-of-patients-on-the-learning-disability-register-with-down-s-syndrome-aged-18-and-over-who-have-a-record-of-blood-tsh-in-the-previous-15-months-excluding-those-who-are-on-the-thyroid-disease-register",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/supporting-the-health-and-care-system-to-implement-virtual-wards",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/supporting-the-health-care-system-to-implement-virtual-wards",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/board-executive-team-and-senior-leaders-interests-register",
				destination:
					"/about-us/our-board/board-executive-team-and-senior-leaders-interests-register",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/patient-access-schemes-liaison-unit#list-of-arrangements",
				destination: "/what-nice-does/commercial-liaison-team",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-fellows-and-scholars-programmes-have-now-closed",
				destination: "/get-involved",
				permanent: true,
			},
			{
				source:
					"/news/article/join-the-nice-network-of-health-and-social-care-leaders",
				destination: "/news",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/get-involved/quality-standard-consultations",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source:
					"/get-involved/careers/our-benefits--rewards-and-work-life-balance",
				destination: "/careers/our-benefits-rewards-and-work-life-balance",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/get-involved/support-a-quality-standard",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/get-involved/topic-engagement",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/about/what-we-do/prioritising-our-guidance-topics",
				destination:
					"/what-nice-does/our-guidance/Prioritising-our-guidance-topics",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-and-health-inequalities",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities",
				permanent: true,
			},
			{
				source: "/get-involved/careers/we-care-about-our-staff",
				destination: "/careers",
				permanent: true,
			},
			{
				source: "/get-involved/careers/diversity-and-inclusion",
				destination: "/careers",
				permanent: true,
			},
			{
				source: "/about/nice-communities/nice-and-the-public",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/about/what-we-do/office-for-market-access",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/commercial-liaison-team",
				destination: "/what-nice-does/accreditation",
				permanent: true,
			},
			{
				source: "/about/what-we-do/science-policy-research",
				destination: "/what-nice-does/our-research-work",
				permanent: true,
			},
			{
				source: "/Orchard.MediaLibrary/ClientStorage/Index",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/executive-recruitment",
				destination: "/careers",
				permanent: true,
			},
			{
				source: "/about/nice-communities/generalpractice",
				destination:
					"/implementing-nice-guidance/general-practice-keep-your-practice-up-to-date",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-syndication-api",
				destination: "/reusing-our-content/nice-syndication-api",
				permanent: true,
			},
			{
				source: "/get-involved/careers/digital-at-nice",
				destination: "/careers/digital-at-nice",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-international",
				destination: "/what-nice-does/nice-international",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work",
				destination: "/what-nice-does/our-research-work",
				permanent: true,
			},
			{
				source: "/about/what-we-do/evidence-services",
				destination: "/what-nice-does/",
				permanent: true,
			},
			{
				source: "/about/nice-communities/social-care",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/about/what-we-do/accreditation",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice",
				destination: "/implementing-nice-guidance/into-practice-resources",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/digital",
				destination: "/careers/digital-at-nice",
				permanent: true,
			},
			{
				source: "/guidance/ng80/resources/",
				destination: "/news",
				permanent: true,
			},
			{
				source: "/savingsAndProductivity/collection",
				has: [
					{ type: "query", key: "page", value: "1" },
					{ type: "query", key: "pageSize", value: "2000" },
					{ type: "query", key: "type", value: "Do not do" },
					{ type: "query", key: "published" }, // just check existence
				],
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/selecting-and-prioritising-quality-standard-topics",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source:
					"/forms/subscribe-to-medicines-and-prescribing-important-new-evidence",
				destination: "/nice-newsletters-and-alerts",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/quality-standards",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/get-involved",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/news/nice-newsletters-and-alerts",
				destination: "/nice-newsletters-and-alerts",
				permanent: true,
			},
			{
				source: "/what-we-do/evidence-services",
				destination: "/library-and-knowledge-services",
				permanent: true,
			},
			{
				source: "/get-involved/careers",
				destination: "/careers",
				permanent: true,
			},
			{
				source: "/news/press-and-media",
				destination: "/news",
				permanent: true,
			},
			{
				source: "/about/who-we-are",
				destination: "/about",
				permanent: true,
			},
			{
				source: "/guidance/hte1",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/models-for-the-evaluation-and-purchase-of-antimicrobials",
				permanent: true,
			},
			{
				source: "/guidance/hte2",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/models-for-the-evaluation-and-purchase-of-antimicrobials",
				permanent: true,
			},
			{
				source: "/terms-and-conditions#notice-of-rights",
				destination: "/terms-and-conditions",
				permanent: true,
			},
			{
				source: "/NICE-Pathways-feedback",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/leave-feedback",
				destination: "/forms/leave-feedback",
				permanent: true,
			},
			{
				source: "/bnf-uk-only",
				destination: "/bnf-via-nice-is-only-available-in-the-uk",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/participation-in-clinical-trials-and-subsequent-access-to-drugs-appraised-by-nice-a-statement-on-the-applicability-of-about-technology-appraisal-guidance",
				destination:
					"/position-statements/participation-in-clinical-trials-and-subsequent-access-to-drugs-appraised-by-nice-a-statement-on-the-applicability-of-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/technology-appraisal-and-highly-specialised-technologies-appeals/past-appeals-and-decisions",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-and-highly-specialised-technologies-appeals/past-appeals-and-decisions",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/developing-a-positive-working-culture-for-supporting-disabled-children-and-young-people-with-severe-complex-needs",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/biosimilar-technologies-nice-position-statement-information-for-the-public",
				destination:
					"/position-statements/biosimilar-technologies-nice-position-statement-information-for-the-public",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-about-technology-appraisal-guidance/Technology-appraisal-and-Highly-specialised-technologies-appeals",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-and-highly-specialised-technologies-appeals",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/technology-appraisal-submission-templates-and-supporting-documents",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-submission-templates-and-supporting-documents",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/improving-young-people-s-experiences-in-transition-to-and-from-inpatient-mental-health-settings",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/provider-information/core-standards--non-agents",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/overview-how-we-develop-about-technology-appraisal-guidance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/how-we-develop-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/chemotherapy-dose-standardisation-nice-position-statement",
				destination:
					"/position-statements/chemotherapy-dose-standardisation-nice-position-statement",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/organisations-eligible-to-use-the-framework",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases",
				permanent: true,
			},

			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/provider-information/core-standards--agents",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/promoting-wellbeing-and-positive-identity-for-a-child-or-young-person-who-is-looked-after",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-dementia-with-the-contact-details-of-a-named-carer-on-their-record",
				destination: "/indicators/IND114-dementia-named-carer",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/provider-information/sole-supplied-titles",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/sole-supplied-titles",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/arranging-services-for-people-with-a-learning-disability-and-behaviour-that-challenges",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/supporting-people-who-provide-unpaid-care-for-adults-with-health-or-social-care-needs",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/modular-updates-for-technology-appraisals-guidance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/modular-updates-for-our-technology-appraisal-guidance",
				permanent: true,
			},

			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/purchasing-steps--further-competition",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/purchasing-steps-further-competition",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-cvd-who-are-currently-treated-with-a-lipid-lowering-therapy",
				destination:
					"/indicators/IND230-cardiovascular-disease-prevention-secondary-prevention-with-lipid-lowering-therapies",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/biosimilar-technologies-nice-position-statement",
				destination:
					"/position-statements/biosimilar-technologies-nice-position-statement",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/technology-appraisal-guidance/planning-your-technology-appraisal-submission-to-nice",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/planning-your-technology-appraisal-submission-to-nice",
				permanent: true,
			},
			{
				source:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration--guidelines--quality-standards-and-indicators",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration-guidelines-quality-standards-and-indicators",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/changes-to-health-technology-evaluation",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books--journals-and-databases/purchasing-steps--direct-awards",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/purchasing-steps-direct-awards",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/achieving-and-demonstrating-compliance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/compliance-with-nice-approved-medicine-or-treatment",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books-journals-and-databases/purchasing-steps--direct-awards",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/purchasing-steps-direct-awards",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/data/cancer-appraisal-recommendations",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-data-cancer-appraisal-recommendations",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/helping-to-prevent-winter-deaths-and-illnesses-associated-with-cold-homes",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/uk-licensing-and-technology-appraisals",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/uk-licensing-and-technology-appraisals",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/data/appraisal-recommendations",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-data-appraisal-recommendations",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/support-for-vcs-organisations/help-us-develop-guidance",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-a-voluntary-and-community-sector-organisation/how-voluntary-and-community-sector-organisations-can-help-us-develop-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/mapping-nice-guidelines-to-the-care-quality-commission-s-single-assessment-framework",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/mapping-nice-guidelines-to-the-cqc-s-single-assessment-framework",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books-journals-and-databases/provider-information",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases/provider-information",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides-for-social-care/therapeutic-interventions-after-abuse-and-neglect",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides-for-social-care/promoting-independence-through-intermediate-care",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/data-collection-agreement",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/data-collection-agreement",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/getting-involved-as-someone-with-lived-experience",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-someone-with-lived-experience",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/charging/procedure-tahst",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/fees-for-technology-appraisals-and-highly-specialised-technologies/charging-procedure",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/types-of-recommendation",
				destination:
					"/what-nice-does/our-guidance/types-of-recommendation-nice-can-make",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/coding-recommendations",
				destination:
					"/what-nice-does/our-guidance/about-interventional-procedures-guidance/clinical-coding-recommendations-for-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers--september-2024",
				destination:
					"/about-us/our-board/public-board-meetings/2024/public-board-meetings-agenda-and-papers-september-2024",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/process/mta-timeline",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/technology-appraisal-processes-and-timelines/multiple-technology-appraisal-process-timeline",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers-september-2023",
				destination:
					"/about-us/our-board/public-board-meetings/2023/public-board-meeting-agenda-and-papers-september-2023",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers-december-2023",
				destination:
					"/about-us/our-board/public-board-meetings/2023/public-board-meeting-agenda-and-papers-december-2023",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/recognising-and-responding-to-domestic-violence-and-abuse",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/dementia-discussing-and-planning-support-after-diagnosis",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/nice-voluntary-and-community-sector-forum",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-a-voluntary-and-community-sector-organisation/nice-voluntary-and-community-sector-forum",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/public-involvement-programme-expert-panel",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-someone-with-lived-experience/join-our-people-and-communities-network",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers--july-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-july-2022",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers--july-2023",
				destination:
					"/about-us/our-board/public-board-meetings/2023/public-board-meeting-agenda-and-papers-july-2023",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/public-board-meeting-agenda-and-papers--july-2024",
				destination:
					"/about-us/our-board/public-board-meetings/2024/public-board-meeting-agenda-and-papers-july-2024",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/process/sta-timeline",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/technology-appraisal-processes-and-timelines/single-technology-appraisal-timeline",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/building-independence-through-planning-for-transition",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/moving-between-hospital-and-home-including-care-homes",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/medical-technologies-guidance/register-as-a-stakeholder",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration-medical-technologies",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/promoting-positive-mental-wellbeing-for-older-people",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/reducing-the-risk-violent-and-aggressive-behaviours",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-diagnostics-guidance/dt-stakeholder-registration",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration-diagnostic-technologies",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/what-to-expect-during-assessment-and-care-planning",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/assessment-and-diagnosis-of-autism-what-to-expect",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/digital-health/multi-agency-advisory-service-for-ai-and-data-driven-technologies",
				destination:
					"/what-nice-does/digital-health/artificial-intelligence-ai-and-digital-regulations-service",
				permanent: true,
			},

			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/openathens-registration-help",
				destination:
					"/library-and-knowledge-services/openathens/openathens-registration-help",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/board/public-board-meetings/public-board-meeting-agenda-and-papers--january-2022",
				destination: "/about-us/our-board/public-board-meetings/2022",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/evidence-for-strengths-and-asset-based-outcomes",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/charging",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/fees-for-technology-appraisals-and-highly-specialised-technologies",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/board/public-board-meetings/public-board-meeting-agenda-and-papers--march-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-march-2022",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/improving-oral-health-for-adults-in-care-homes",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-medical-technologies-guidance/get-involved",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/get-involved-with-medical-technologies-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/implementing-nice-guidance",
				destination: "/implementing-nice-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice",
				destination: "/implementing-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Highly-Specialised-Technologies-Evaluation-Committee/Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/highly-specialised-technologies-evaluation-committee/highly-specialised-technologies-evaluation-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/library-and-knowledge-services-staff/buy-books-journals-and-databases",
				destination:
					"/library-and-knowledge-services/buy-books-journals-and-databases",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/life-sciences/our-role-in-the-innovative-licensing-and-access-pathway--ilap",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/our-role-in-the-innovative-licensing-and-access-pathway-ilap",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/notify",
				destination:
					"/what-nice-does/our-guidance/about-interventional-procedures-guidance/notify-an-interventional-procedure",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-medical-technologies-evaluation-programme",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/get-a-medical-technology-evaluated",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-research-work/use-of-ai-in-evidence-generation--nice-position-statement",
				destination:
					"/position-statements/use-of-AI-in-evidence-generation-NICE-position-statement",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-highly-specialised-technologies-guidance",
				destination:
					"/what-nice-does/our-guidance/about-highly-specialised-technologies-guidance",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/support-for-vcs-organisations",
				destination:
					"/get-involved/people-and-communities/getting-involved-as-a-voluntary-and-community-sector-organisation",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/effective-record-keeping-ordering-medicines",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/enabling-positive-lives-for-autistic-adults",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/openathens-eligibility",
				destination:
					"/library-and-knowledge-services/openathens/openathens-eligibility",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-about-technology-appraisal-guidance/data",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-research-work/partnering-with-us-for-research---timescales-and-process",
				destination:
					"/what-nice-does/our-research-work/partnering-with-us-for-research-timescales-and-process",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/about-technology-appraisal-guidance/eq-5d-5l",
				destination:
					"/position-statements/position-statement-on-use-of-the-eq-5d-5l-value-set-for-england-updated-october-2019",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/discussing-and-planning-medicines-support",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-diagnostics-guidance/process-timeline",
				destination:
					"/what-nice-does/our-guidance/about-diagnostics-guidance/diagnostics-assessment-programme-process-timeline",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-technology-appraisal-guidance/process",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/methods-and-processes-used-before-2022",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/openathens-support",
				destination:
					"/library-and-knowledge-services/openathens/openathens-support",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-about-medical-technologies-guidance",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-about-technology-appraisal-guidance",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/making-a-positive-impact",
				destination:
					"/get-involved/people-and-communities/making-a-positive-impact-people-and-communities-network-case-studies",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/good-practice-in-safeguarding-training",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/modern-slavery-and-human-trafficking-statement",
				destination:
					"/about-us/policies-procedures-and-reports/modern-slavery-and-human-trafficking-statement",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-interventional-procedures-guidance",
				destination:
					"/what-nice-does/our-guidance/about-interventional-procedures-guidance",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Highly-Specialised-Technologies-Evaluation-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/highly-specialised-technologies-evaluation-committee",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Interventional-Procedures-Advisory-Committee/Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/interventional-procedures-advisory-committee/interventional-procedures-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/recognising-and-preventing-delirium",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/appraisal-methodology-for-records-1999-2013",
				destination:
					"/about-us/policies-procedures-and-reports/appraisal-methodology-for-records-1999-2013",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-appraisal-Committee/Committee-A-Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees/tac-a-members",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-appraisal-Committee/Committee-B-Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees/tac-b-members",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-appraisal-Committee/Committee-C-Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees/tac-c-members",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-appraisal-Committee/Committee-D-Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees/tac-d-members",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/helping-to-prevent-pressure-ulcers",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-and-papers-march-2024",
				destination: "/about-us/our-board/public-board-meetings/2024",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-september-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-september-2022",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/better-home-care-for-older-people",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-december-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-december-2022",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-december-2024",
				destination:
					"/about-us/our-board/public-board-meetings/2024/public-board-meeting-agenda-and-papers-december-2024",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Medical-Technologies-Advisory-Committee/Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/medical-technologies-advisory-committee/medical-technologies-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/creating-a-safeguarding-culture",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/understanding-intermediate-care",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/using-nice-guidance-principal-social-workers",
				destination:
					"/implementing-nice-guidance/social-care/using-nice-guidance-in-social-work-scenarios/families-and-relationships-settings/developing-relationships-with-parents",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/getting-help-to-overcome-abuse",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/person-centred-future-planning",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/prioritising-our-guidance-topics/our-prioritisation-decisions",
				destination:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-march-2023",
				destination: "/about-us/our-board/public-board-meetings/2023",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-march-2025",
				destination: "/about-us/our-board/public-board-meetings/2025",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Interventional-Procedures-Advisory-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/interventional-procedures-advisory-committee",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/helping-to-prevent-infection",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/indicator-advisory-committee-iac/iac-members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/indicator-advisory-committee/indicator-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-may-2022",
				destination:
					"/about-us/our-board/public-board-meetings/2022/public-board-meeting-agenda-and-papers-may-2022",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-may-2023",
				destination:
					"/about-us/our-board/public-board-meetings/2023/public-board-meeting-agenda-and-papers-may-2023",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-board-meetings/agenda-papers-may-2024",
				destination:
					"/about-us/our-board/public-board-meetings/2024/public-board-meeting-agenda-and-papers-may-2024",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement/involving-you",
				destination:
					"/get-involved/people-and-communities/involving-you-in-the-development-of-our-guidance",
				permanent: true,
			},

			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/openathens/access",
				destination:
					"/library-and-knowledge-services/openathens/openathens-access",
				permanent: true,
			},
			{
				source:
					"/get-involved/study-nice-and-lse-s-executive-msc-healthcare-decision-making",
				destination:
					"/get-involved/nice-training-and-development-opportunities/study-nice-and-lse-s-executive-msc-healthcare-decision-making",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/giving-medicines-covertly",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-advice/medtech-innovation-briefings",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/medtech-innovation-briefings",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/trade-union-facility-time-report",
				destination:
					"/about-us/policies-procedures-and-reports/trade-union-facility-time-report",
				permanent: true,
			},
			{
				source:
					"/get-involved/register-as-a-stakeholder/who-can-register-as-a-stakeholder",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/who-can-register-as-a-stakeholder",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Our-Programmes/NICE-guidance/NICE-diagnostics-guidance",
				destination: "/what-nice-does/our-guidance/about-diagnostics-guidance",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Medical-Technologies-Advisory-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/medical-technologies-advisory-committee",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Diagnostics-Advisory-Committee/Members",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/diagnostics-advisory-committee/diagnostics-advisory-committee-members",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quick-guides/advance-care-planning",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/using-nice-guidance-in-social-work",
				destination:
					"/implementing-nice-guidance/social-care/using-nice-guidance-in-social-work-scenarios",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Quality-Standards-Advisory-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/quality-standards-advisory-committee",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/evidence-services/journals-and-databases/OpenAthens",
				destination: "/library-and-knowledge-services/openathens",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/into-practice/measuring-the-uptake-of-nice-guidance",
				destination:
					"/implementing-nice-guidance/measuring-the-use-of-nice-guidance",
				permanent: true,
			},
			{
				source:
					"/get-involved/stakeholder-registration/tobacco-industry-organisations",
				destination:
					"/position-statements/position-statement-on-engagement-with-tobacco-industry-organisations",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/get-involved/quality-standard-consultations",
				destination:
					"/get-involved/help-develop-quality-standards/quality-standard-consultations",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/antimicrobials-evaluation-committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/antimicrobial-evaluation-committee",
				permanent: true,
			},
			{
				source:
					"/get-involved/meetings-in-public/public-health-advisory-committees",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/public-health-advisory-committees",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/social-care-trainers-resource",
				destination:
					"/implementing-nice-guidance/social-care/social-care-trainers-resource",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-research-work/methodological-research-areas",
				destination: "/what-nice-does/our-research-work/methods-research-areas",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/proportionate-approach-to-technology-appraisals",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/our-methods-and-processes-health-technology-evaluation-manual/taking-a-proportionate-approach-to-technology-appraisals",
				permanent: true,
			},
			{
				source:
					"/get-involved/careers/our-benefits--rewards-and-work-life-balance",
				destination: "/careers/our-benefits-rewards-and-work-life-balance",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/get-involved/support-a-quality-standard",
				destination:
					"/get-involved/help-develop-quality-standards/support-a-quality-standard",
				permanent: true,
			},
			{
				source:
					"/About/What-we-do/Evidence-Services/Clinical-knowledge-summaries",
				destination: "https://cks.nice.org.uk/",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/child-abuse-neglect-guidance",
				destination:
					"/implementing-nice-guidance/social-care/child-abuse-and-neglect-guidance",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/social-care/quality-improvement-resource",
				destination:
					"/implementing-nice-guidance/social-care/quality-improvement-resource-for-adult-social-care",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/nice-international/knowledge-transfer-seminars",
				destination:
					"/what-nice-does/nice-international/knowledge-transfer-seminars",
				permanent: true,
			},
			{
				source:
					"/get-involved/stakeholder-registration/confidentiality-agreement",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder/stakeholder-registration-confidentiality-agreement",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Diagnostics-Advisory-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/diagnostics-advisory-committee",
				permanent: true,
			},
			{
				source:
					"/Get-Involved/Meetings-in-public/Technology-Appraisal-Committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/technology-appraisal-committees",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/cost-savings-resource-planning",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-advice/evidence-summaries",
				destination: "/what-nice-does/our-guidance/about-evidence-summaries",
				permanent: true,
			},
			{
				source:
					"/standards-and-indicators/timeline-developing-quality-standards",
				destination:
					"/what-nice-does/standards-and-indicators/quality-standards/timeline-for-developing-quality-standards",
				permanent: true,
			},
			{
				source:
					"/About/Who-we-are/Policies-and-procedures/NICE-equality-scheme",
				destination:
					"/about-us/policies-procedures-and-reports/edi-roadmap-and-annual-action-plan",
				permanent: true,
			},
			{
				source:
					"/about/nice-communities/nice-and-the-public/public-involvement",
				destination: "/get-involved/people-and-communities",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/modular-updates",
				destination: "/what-nice-does/our-guidance/modular-updates",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/our-programmes/nice-guidance/nice-guidelines",
				destination: "/what-nice-does/our-guidance/about-nice-guidelines",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/gender-pay-gap-report",
				destination:
					"/about-us/policies-procedures-and-reports/gender-pay-gap-report",
				permanent: true,
			},
			{
				source:
					"/about/who-we-are/corporate-publications/transparency-of-spend",
				destination:
					"/about-us/policies-procedures-and-reports/transparency-of-spend",
				permanent: true,
			},
			{
				source:
					"/get-involved/jobs/our-benefits--rewards-and-work-life-balance",
				destination: "/careers/our-benefits-rewards-and-work-life-balance",
				permanent: true,
			},
			{
				source:
					"/get-involved/our-committees/how-gps-help-develop-our-guidance",
				destination: "/get-involved/gps-and-primary-care",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-international/about-nice-international",
				destination:
					"/what-nice-does/nice-international/about-nice-international",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-international/adapting-nice-guidelines",
				destination:
					"/what-nice-does/nice-international/adapting-nice-guidelines",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work/our-projects-and-partners",
				destination:
					"/what-nice-does/our-research-work/our-projects-and-partners",
				permanent: true,
			},
			{
				source: "/get-involved/meetings-in-public/indicator-advisory-committee",
				destination:
					"/get-involved/our-committees/nice-committee-meetings/indicator-advisory-committee",
				permanent: true,
			},
			{
				source: "/about/nice-communities/library-and-knowledge-services-staff",
				destination: "/library-and-knowledge-services",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/help-implement-nice-guidance",
				destination: "/get-involved/help-implement-nice-guidance",
				permanent: true,
			},
			{
				source: "/About/What-we-do/Evidence-Services/journals-and-databases",
				destination: "/library-and-knowledge-services",
				permanent: true,
			},
			{
				source: "/about/what-we-do/digital-health/office-for-digital-health",
				destination: "/what-nice-does/digital-health/office-for-digital-health",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/resource-impact-assessment",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/assessing-the-resource-impact-of-nice-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/bringing-our-guidance-together-by-topic",
				destination:
					"/what-nice-does/our-guidance/bringing-our-guidance-together-by-topic",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-international/consultancy-services",
				destination: "/what-nice-does/nice-international/consultancy-services",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-international/speaking-engagements",
				destination: "/what-nice-does/nice-international/speaking-engagements",
				permanent: true,
			},
			{
				source: "/get-involved/our-committees/what-professional-members-do",
				destination:
					"/get-involved/our-committees/your-role-as-a-nice-committee-member",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/quality-standards-topic-library",
				destination:
					"/what-nice-does/standards-and-indicators/quality-standards/selecting-and-prioritising-quality-standard-topics",
				permanent: true,
			},
			{
				source: "/Get-Involved/Meetings-in-public/Appeal-panel-membership",
				destination:
					"/what-nice-does/our-guidance/about-technology-appraisal-guidance/technology-appraisal-and-highly-specialised-technologies-appeals/appeal-panel-membership",
				permanent: true,
			},
			{
				source: "/about/who-we-are/executive-team/executive-team-meetings",
				destination: "/about-us/executive-team/executive-team",
				permanent: true,
			},
			{
				source: "/about/nice-communities/generalpractice/reference-panel",
				destination: "/forms/subscribe-to-our-gp-reference-panel",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/get-involved/topic-engagement",
				destination:
					"/get-involved/help-develop-quality-standards/topic-engagement",
				permanent: true,
			},
			{
				source: "/Get-Involved/Meetings-in-public/Public-board-meetings",
				destination: "/about-us/our-board/public-board-meetings",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/how-to-use-quality-standards",
				destination:
					"/what-nice-does/standards-and-indicators/quality-standards/how-to-use-quality-standards",
				permanent: true,
			},
			{
				source: "/about/what-we-do/forward-view---our-priority-topics",
				destination:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics/forward-view-our-priority-topics",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work/hta-lab-projects",
				destination:
					"/what-nice-does/our-research-work/hta-lab/hta-lab-projects",
				permanent: true,
			},
			{
				source: "/terms-and-conditions/cks-end-user-licence-agreement",
				destination: "/cks-end-user-licence-agreement",
				permanent: true,
			},
			{
				source: "/about/what-we-do/late-stage-assessment-for-medtech",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/late-stage-assessment-lsa-for-medtech",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences/life-sciences-tools",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/tools-for-building-or-evaluating-an-evidence-base",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences/nice-advice-service",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market/nice-advice-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/commercial-liaison-team/services",
				destination:
					"/what-nice-does/patient-access-schemes-and-pricing-agreements/services",
				permanent: true,
			},
			{
				source: "/about/what-we-do/prioritising-our-guidance-topics",
				destination:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics",
				permanent: true,
			},
			{
				source: "/about/nice-communities/medicines-and-prescribing",
				destination: "/implementing-nice-guidance/medicines-and-prescribing",
				permanent: true,
			},
			{
				source: "/about/nice-communities/social-care/quick-guides",
				destination:
					"/implementing-nice-guidance/social-care/quick-guides-to-social-care-topics",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/resource-planner",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/resource-planner",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work/nice-listens",
				destination: "/what-nice-does/our-research-work/nice-listens",
				permanent: true,
			},
			{
				source: "/get-involved/our-committees/what-lay-members-do",
				destination:
					"/get-involved/our-committees/your-role-as-a-nice-committee-member",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/nice-field-team",
				destination:
					"/implementing-nice-guidance/implementation-help-and-advice/helping-you-put-our-guidance-into-practice",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes/managed-access",
				destination:
					"/what-nice-does/patient-access-schemes-and-pricing-agreements/managed-access",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes/patient-safety",
				destination: "/patient-safety",
				permanent: true,
			},
			{
				source: "/re-using-our-content/content-assurance-service",
				destination: "/reusing-our-content/content-assurance-service",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-and-health-inequalities",
				destination:
					"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-programmes/nice-guidance",
				destination: "/what-nice-does/our-guidance",
				permanent: true,
			},
			{
				source: "/about/what-we-do/into-practice/adoption-team",
				destination:
					"/implementing-nice-guidance/implementation-help-and-advice/adoption-and-implementation-support",
				permanent: true,
			},
			{
				source: "/get-involved/careers/diversity-and-inclusion",
				destination: "/careers/diversity-and-inclusion",
				permanent: true,
			},
			{
				source: "/get-involved/careers/we-care-about-our-staff",
				destination: "/careers/we-care-about-our-staff",
				permanent: true,
			},
			{
				source: "/re-using-our-content/uk-open-content-licence",
				destination: "/forms/use-of-nice-content-in-the-uk-form",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work/hta-lab",
				destination:
					"/what-nice-does/our-research-work/health-technology-assessment-innovation-laboratory",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/quality-standards",
				destination:
					"/what-nice-does/standards-and-indicators/quality-standards",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/diversity-and-inclusion",
				destination: "/careers/diversity-and-inclusion",
				permanent: true,
			},
			{
				source: "/get-involved/jobs/we-care-about-our-staff",
				destination: "/careers/we-care-about-our-staff",
				permanent: true,
			},
			{
				source: "/about/what-we-do/commercial-liaison-team",
				destination:
					"/what-nice-does/patient-access-schemes-and-pricing-agreements",
				permanent: true,
			},
			{
				source: "/about/who-we-are/policies-and-procedures",
				destination: "/about-us/policies-procedures-and-reports",
				permanent: true,
			},
			{
				source: "/about/who-we-are/board/board-committees",
				destination: "/about-us/our-board/board-committees",
				permanent: true,
			},
			{
				source: "/about/who-we-are/corporate-publications",
				destination: "/about-us/corporate-publications",
				permanent: true,
			},
			{
				source: "/about/who-we-are/senior-management-team",
				destination: "/about-us/executive-team/",
				permanent: true,
			},
			{
				source: "/about/nice-communities/generalpractice",
				destination:
					"/implementing-nice-guidance/general-practice-keep-your-practice-up-to-date",
				permanent: true,
			},
			{
				source: "/About/Who-we-are/Board/Board-expenses",
				destination: "/about-us/our-board/board-expenses",
				permanent: true,
			},
			{
				source: "/Get-Involved/stakeholder-registration",
				destination:
					"/get-involved/register-your-organisation-as-a-stakeholder",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-syndication-api",
				destination: "/reusing-our-content/nice-syndication-api",
				permanent: true,
			},
			{
				source: "/get-involved/careers/digital-at-nice",
				destination: "/careers/digital-at-nice",
				permanent: true,
			},
			{
				source: "/about/what-we-do/nice-international",
				destination: "/what-nice-does/nice-international",
				permanent: true,
			},
			{
				source: "/about/who-we-are/guidance-executive",
				destination: "/about-us/guidance-executive",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/indicators",
				destination: "/what-nice-does/standards-and-indicators/indicators",
				permanent: true,
			},
			{
				source: "/about/nice-communities/social-care",
				destination: "/implementing-nice-guidance/social-care/",
				permanent: true,
			},
			{
				source: "/about/what-we-do/our-research-work",
				destination: "/what-nice-does/our-research-work",
				permanent: true,
			},
			{
				source: "/about/who-we-are/structure-of-nice",
				destination: "/about-us/structure-of-nice",
				permanent: true,
			},
			{
				source: "/about/what-we-do/eva-for-medtech",
				destination:
					"/what-nice-does/our-guidance/about-medical-technologies-guidance/early-value-assessment-eva-for-medtech",
				permanent: true,
			},
			{
				source: "/about/who-we-are/history-of-nice",
				destination: "/about-us/history-of-nice",
				permanent: true,
			},
			{
				source: "/news/nice-newsletters-and-alerts",
				destination: "/nice-newsletters-and-alerts",
				permanent: true,
			},
			{
				source: "/re-using-our-content/public-task",
				destination: "/reusing-our-content/public-task",
				permanent: true,
			},
			{
				source: "/Get-Involved/Meetings-in-public",
				destination: "/get-involved/meetings-in-public",
				permanent: true,
			},
			{
				source: "/about/what-we-do/digital-health",
				destination: "/what-nice-does/digital-health",
				permanent: true,
			},
			{
				source: "/about/who-we-are/our-principles",
				destination: "/about-us/our-principles",
				permanent: true,
			},
			{
				source: "/about/who-we-are/sustainability",
				destination: "/about-us/sustainability",
				permanent: true,
			},
			{
				source: "/about/what-we-do/accreditation",
				destination: "/what-nice-does/accreditation",
				permanent: true,
			},
			{
				source: "/about/what-we-do/life-sciences",
				destination:
					"/what-nice-does/life-sciences-how-to-get-your-product-to-market",
				permanent: true,
			},
			{
				source: "/forms/life-sciences-contact-us",
				destination: "/forms/nice-advice-contact-us",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/index",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/about/who-we-are/our-charter",
				destination: "/about-us/corporate-publications/our-charter",
				permanent: true,
			},
			{
				source: "/Get-Involved/our-committees",
				destination: "/get-involved/our-committees",
				permanent: true,
			},
			{
				source: "/Get-Involved/Consultations",
				destination: "/get-involved/consultations",
				permanent: true,
			},
			{
				source: "/standards-and-indicators",
				destination: "/what-nice-does/standards-and-indicators",
				permanent: true,
			},
			{
				source: "/get-involved/contact-us",
				destination: "/contact-us",
				permanent: true,
			},
			{
				source: "/about/who-we-are/board",
				destination: "/about-us/our-board/board-members",
				permanent: true,
			},
			{
				source: "/get-involved/careers",
				destination: "/careers",
				permanent: true,
			},
			{
				source: "/news/press-and-media",
				destination: "/contact-us",
				permanent: true,
			},
			{
				source: "/re-using-our-content",
				destination: "/reusing-our-content",
				permanent: true,
			},
			{
				source: "/covid-19/rapid-c19",
				destination: "/rapid-c-19",
				permanent: true,
			},
			{
				source: "/get-involved/jobs",
				destination: "/careers",
				permanent: true,
			},
			{
				source: "/guidance/proposed",
				destination: "/guidance/awaiting-development",
				permanent: true,
			},
			{
				source: "/about/what-we-do",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source: "/bnfc-uk-only",
				destination: "/bnfc-via-nice-is-only-available-in-the-uk",
				permanent: true,
			},
			{
				source: "/bnf-uk-only",
				destination: "/bnf-via-nice-is-only-available-in-the-uk",
				permanent: true,
			},
			{
				source: "/cks-uk-only",
				destination: "/cks-is-only-available-in-the-uk",
				permanent: true,
			},
			{
				source: "/news/events",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/indicators",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/about",
				destination: "/about-us",
				permanent: true,
			},
			{
				source: "/oForms/ResultsAdmin/ShowFormResults/:path*",
				destination: "/what-nice-does",
				permanent: true,
			},
			{
				source:
					"/about/what-we-do/research-and-development/research-recommendations/:slug*",
				destination:
					"/about/what-we-do/science-policy-research/research-recommendations",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/qofindicators/:path*",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/gpqualityimprovements/:path*",
				destination: "/indicators/published",
				permanent: true,
			},
			{
				source: "/standards-and-indicators/ccgoisindicators/:path*",
				destination: "/indicators/published",
				permanent: true,
			},
		];
	},
	async headers() {
		return [
			{
				// Add common headers to all pages
				source: "/(.*)",
				headers: commonHeaders,
			},
		];
	},
	transpilePackages: [
		...niceDigitalModulesToTranspile,
		...nonES5ModulesToTranspile,
		...globalNavHooksToTranspile,
	],
	typescript: {
		// We run our own typechecking so no need to do it twice
		ignoreBuildErrors: process.env.NODE_ENV === "production",
	},
	sassOptions: {
		fiber: false,
		includePaths: [path.join(__dirname, "node_modules/@nice-digital")],
	},
	images: {
		// https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
		remotePatterns: [
			{
				protocol: "https",

				hostname: "**.nice.org.uk",
				port: "",
			},
			{
				protocol: "https",

				hostname: "a.storyblok.com",
				port: "",
			},
		],
	},
};

// The weird comment syntax below is a JSDoc TypeScript cast: https://edibleco.de/2UMm8nx
/** @type {import('next').NextConfig} */
const finalConfig = withNodeConfig(nextConfig);

// Delete the following properties now we are finished with them or next-js will warn 'root value has an unexpected property xxx - which is not in the list of allowed properties'
delete finalConfig["nodeConfigServerKey"];
delete finalConfig["nodeConfigPublicKey"];

module.exports = finalConfig;
