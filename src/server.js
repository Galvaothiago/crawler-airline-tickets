import express from "express";
import puppeteer from "puppeteer";
import {transformData} from "./transformData.js";
import {getAlternativesDate} from "./utils.js";
import {BrowserPupputeer} from "./services/BrowserPuppeteer.js";

const app = express();
const port = 3333;

app.use(express.json());

app.get("/teste", (req, res) => {
	const {initialDate, finalDate} = req.query;

	const result = getAlternativesDate(initialDate, finalDate);

	console.log(result);

	res.json(result);
});

app.get("/", async (req, res) => {
	const {initialDate, finalDate} = req.query;

	const alternativesDate = getAlternativesDate(initialDate, finalDate);
	let finalResult = [];

	const puppeteer = new BrowserPupputeer();

	await puppeteer.init();

	for (let i = 0; i < alternativesDate.length; i++) {
		const [initialDate, finalDate] = alternativesDate[i];

		const data = await puppeteer.searchFlight("VCP", "VIX", initialDate, finalDate);

		finalResult.push(data);
	}

	await puppeteer.close();

	res.json(finalResult);
});

app.listen(port, () => console.log("Server is running"));
