import express from "express";
import {BrowserPupputeer} from "./services/BrowserPuppeteer.js";
import {getAlternativesDate} from "./utils.js";

const app = express();
const port = 3333;

app.use(express.json());

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

	res.json(finalResult);
	await puppeteer.close();
});

app.listen(port, () => console.log("Server is running"));
