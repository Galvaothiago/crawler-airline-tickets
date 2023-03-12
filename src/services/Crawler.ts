import puppeteer from "puppeteer";
import {Cluster} from "puppeteer-cluster";

export interface InformationFlight {
	departure: string;
	arrival: string;
	initialDate: string;
	finalDate: string;
}

export class Crawler {
	private browser: any;
	private page: any;
	private url: any;

	constructor() {
		this.browser = null;
		this.page = null;
		this.url = "";
	}

	addParamsURL(departure: string, arrival: string, initialDate: string, finalDate: string) {
		this.url = `${process.env.URL_TO_CRAWLER}${departure}/${arrival}/${initialDate}/${finalDate}/1/0/0/EC`;
	}

	async init() {
		this.browser = await puppeteer.launch({
			headless: true,
			args: ["--disable-dev-shm-usage"],
		});
		this.page = await this.browser.newPage();

		await this.page.setViewport({
			width: 1920,
			height: 1080,
		});
	}

	async initPuppeteerCluster() {
		const cluster = await Cluster.launch({
			concurrency: Cluster.CONCURRENCY_CONTEXT,
			maxConcurrency: Number(process.env.PUPPETEER_CLUSTER_MAX_CONCURRENCY),
			puppeteerOptions: {
				headless: true,
				args: ["--disable-dev-shm-usage"],
			},
		});

		return cluster;
	}

	async awaitForXpath(xpath: string) {
		await this.page.waitForXPath(xpath);
	}

	async navigateTo(url: string) {
		await this.page.goto(url, {
			waitUntil: "networkidle2",
		});
	}

	async close() {
		await this.page.close();
		await this.browser.close();

		this.browser = null;
		this.page = null;
		this.url = "";
	}
}
