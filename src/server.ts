import express, {Express, Request, Response} from "express";
import {BrowserPupputeer} from "./services/BrowserPuppeteer";
import {getAlternativesDate} from "./utils";

const app: Express = express();
const port = 3333;

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
	const {initialDate, finalDate} = req.query;

	const alternativesDate: string[][] = getAlternativesDate(String(initialDate), String(finalDate));
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
