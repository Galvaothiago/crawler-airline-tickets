import puppeteer from "puppeteer";
import {transformData} from "../transformData.js";

export class Crawler {
	browser: any;
	page: any;
	url: any;

	constructor() {
		this.browser = null;
		this.page = null;
		this.url = "";
	}

	addParamsURL(departure: string, arrival: string, initialDate: string, finalDate: string) {
		this.url = `https://www.maxmilhas.com.br/busca-passagens-aereas/RT/${departure}/${arrival}/${initialDate}/${finalDate}/1/0/0/EC`;
	}

	async init() {
		this.browser = await puppeteer.launch({
			headless: false,
		});
		this.page = await this.browser.newPage();

		await this.page.setViewport({
			width: 1920,
			height: 1080,
		});
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
		await this.browser.close();
	}

	async searchFlight(departure: string, arrival: string, initialDate: string, finalDate: string) {
		try {
			this.addParamsURL(departure, arrival, initialDate, finalDate);

			await this.navigateTo(this.url);
			await this.awaitForXpath('//*[@id="__next"]/div[3]/section/div[4]/div[2]/div[1]/div/div[1]');

			const data = await this.page.evaluate(async () => {
				let result = [];
				let scrollValue = 0;

				const elementQuantiAirTickets: HTMLElement | null = document.querySelector(".css-7zc1qr");
				const airlineTicketsFound = Number(elementQuantiAirTickets?.innerText.split(" ")[0]);

				function scrollPage(value: number) {
					window.scrollTo(0, value);
				}

				function delay(time: number) {
					return new Promise(function (resolve) {
						setTimeout(resolve, time);
					});
				}

				await delay(4000);

				for (let i = 0; i < 100; i++) {
					let container: HTMLElement | null = document.querySelector(`[data-index="${i}"]`);

					if (container) {
						result.push(container.innerText);
						container = null;
						await delay(300);
					} else {
						scrollPage((scrollValue += 500));
						await delay(600);

						container = document.querySelector(`[data-index="${i}"]`);

						if (container) {
							result.push(container.innerText);
							container = null;
							await delay(300);
						}
					}

					if (result.length === Number(airlineTicketsFound) || scrollValue > 10000) {
						return result;
					}
				}
			});

			const formatContent = (content: string) => {
				const arr = content?.split("Detalhes").join("").split("\n");

				return arr;
			};

			if (!data) {
				return [];
			}

			const result = data.map((item: string) => {
				const content = formatContent(item);

				return transformData(content);
			});

			return result;
		} catch (err) {
			console.log(err);
		}
	}
}