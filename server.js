import axios from "axios";
import express from "express";
import {htmlToText} from "html-to-text";
import puppeteer from "puppeteer";

const app = express();
const port = 3333;

app.use(express.json());

app.get("/", async (req, res) => {
	async function snapScreenshot() {
		try {
			const URL = "https://www.maxmilhas.com.br/busca-passagens-aereas/RT/VCP/VIX/2022-11-27/2023-01-26/1/0/0/EC";

			const browser = await puppeteer.launch();
			const page = await browser.newPage();

			await page.goto(URL, {
				waitUntil: "networkidle2",
			});

			const data = await page.evaluate(() => {
				let results = [];
				const container = document.querySelectorAll(".css-19iprdf");
				const prices = document.querySelectorAll(".price");

				return {
					size: container.length,
				};

				return values;
				return container.innerHTML;

				return prices;
				return container.innerText;
				return text;
			});

			res.send(data);

			await browser.close();
		} catch (error) {
			console.error(error);
		}
	}

	snapScreenshot();
});

app.listen(port, () => console.log("Server is running"));
