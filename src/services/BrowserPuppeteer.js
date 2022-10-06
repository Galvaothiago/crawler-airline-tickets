import puppeteer from "puppeteer";
import {transformData} from "../transformData.js";

export class BrowserPupputeer {
	constructor() {
		this.browser = null;
		this.page = null;
		this.url = "";
	}

	addParamURL(departure, arrival, initialDate, finalDate) {
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

	async awaitForXpath(xpath) {
		await this.page.waitForXPath(xpath);
	}

	async navigateTo(url) {
		await this.page.goto(url, {
			waitUntil: "networkidle2",
		});
	}

	async close() {
		await this.browser.close();
	}

	async searchFlight(departure, arrival, initialDate, finalDate) {
		try {
			this.addParamURL(departure, arrival, initialDate, finalDate);

			await this.navigateTo(this.url);
			await this.awaitForXpath('//*[@id="__next"]/div[3]/section/div[4]/div[2]/div[1]/div/div[1]');

			const data = await this.page.evaluate(async () => {
				let result = [];
				let scrollValue = 0;

				const quantityAirTickets = document.querySelector(".css-7zc1qr")?.innerText.split(" ")[0];

				function scrollPage(value) {
					window.scrollTo(0, value);
				}

				function delay(time) {
					return new Promise(function (resolve) {
						setTimeout(resolve, time);
					});
				}

				await delay(4000);

				for (let i = 0; i < 100; i++) {
					let container = document.querySelector(`[data-index="${i}"]`);

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

					if (result.length === Number(quantityAirTickets) || scrollValue > 10000) {
						return result;
					}
				}
			});

			const formatContent = content => {
				const arr = content?.split("Detalhes").join("").split("\n");

				return arr;
			};

			if (!data) {
				return [];
			}

			const result1 = data.map(item => {
				const content = formatContent(item);

				return transformData(content);
			});

			// await this.close();

			return result1;
		} catch (err) {
			console.error(err);
		}
	}
}
