import express, {NextFunction, Request, Response} from "express";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
	const key = req.body.params?.key ?? "";

	if (!process.env.KEYS_ACCESS) {
		return res.status(401).json({message: "Unauthorized", hasAccess: false});
	}

	const hasAccess = String(process.env.KEYS_ACCESS)
		.split("|")
		.includes(key as string);

	if (!hasAccess) {
		return res.status(200).json({message: "Unauthorized", hasAccess: false});
	}

	return res.status(200).json({message: "Authorized", hasAccess: true});
});

export default router;
