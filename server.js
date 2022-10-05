import axios from "axios";
import express from "express";
import {htmlToText} from "html-to-text";
import puppeteer from "puppeteer";
import {info} from "./teste.js";
import {transformData} from "./transformData.js";

const app = express();
const port = 3333;

app.use(express.json());

app.get("/teste", (req, res) => {
	const {initialDate, finalDate} = req.query;
	const result = info.map(item => {
		return transformData(item);
	});

	console.log({initialDate, finalDate});
	res.json(result);
});

app.get("/", async (req, res) => {
	const {initialDate, finalDate} = req.query;
	async function snapScreenshot() {
		try {
			const url = `https://www.maxmilhas.com.br/busca-passagens-aereas/RT/VCP/VIX/${initialDate}/${finalDate}/1/0/0/EC`;

			const browser = await puppeteer.launch({
				headless: false,
			});
			const page = await browser.newPage();

			await page.setViewport({
				width: 1920,
				height: 1080,
			});

			await page.goto(url, {
				waitUntil: "networkidle2",
			});

			await page.waitForXPath('//*[@id="__next"]/div[3]/section/div[4]/div[2]/div[1]/div/div[1]');

			const data = await page.evaluate(async () => {
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
						await delay(1000);

						container = document.querySelector(`[data-index="${i}"]`);

						if (container) {
							result.push(container.innerText);
							container = null;
							await delay(300);
						}
					}

					if (result.length === Number(quantityAirTickets)) {
						return result;
					}
				}
			});

			const formatContent = content => {
				const arr = content?.split("Detalhes").join("").split("\n");

				return arr;
			};

			if (!data) {
				return res.json({message: "Não foi possível encontrar passagens para essa data."});
			}

			const result1 = data.map(item => {
				const content = formatContent(item);

				return transformData(content);
			});

			res.send(result1);
			await browser.close();
		} catch (error) {
			console.error(error);
		}
	}

	await snapScreenshot();
});

app.listen(port, () => console.log("Server is running"));
