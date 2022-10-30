export enum IATACodeAirport {
	CAMPINAS = "VCP",
	RECIFE = "REC",
	CURITIBA = "CWB",
	BELEM = "BEL",
	VITORIA = "VIX",
	SANTOS_DUMONT = "SDU",
	CUIABA = "CGB",
	CAMPO_GRANDE = "CGR",
	FORTALEZA = "FOR",
	MACAPA = "MCP",
	MARINGA = "MGF",
	GOIANIA = "GYN",
	NAVEGANTES = "NVT",
	MANAUS = "MAO",
	NATAL = "NAT",
	PORTO_SEGURO = "BPS",
	MACEIO = "MCZ",
	PALMAS = "PMW",
	SAO_LUIS = "SLZ",
	GUARULHOS = "GRU",
	LONDRINA = "LDB",
	PORTO_VELHO = "PVH",
	RIO_BRANCO = "RBR",
	JOINVILLE = "JOI",
	UBERLANDIA = "UDI",
	CAXIAS_DO_SUL = "CXJ",
	FOZ_DO_IGUACU = "IGU",
	TERESINA = "THE",
	ARACAJU = "AJU",
	JOAO_PESSOA = "JPA",
	PETROLINA = "PNZ",
	CONFINS = "CNF",
	BOA_VISTA = "BVB",
	CAMPINA_GRANDE = "CPV",
	SANTAREM = "STM",
	ILHEUS = "IOS",
	JUAZEIRO_DO_NORTE = "JDO",
	IMPERATRIZ = "IMP",
	CHAPECO = "XAP",
	MARABA = "MAB",
	CRUZEIRO_DO_SUL = "CZS",
	PRESIDENTE_PRUDENTE = "PPB",
	CABO_FRIO = "CFB",
	FERNANDO_DE_NORONHA = "FEN",
	BAURU = "JTC",
	MONTE_CLAROS = "MOC",
}

export const getIATACodeAirport = (airport: string): IATACodeAirport => {
	airport = airport.toLowerCase();

	switch (airport) {
		case "campinas" || "vcp":
			return IATACodeAirport.CAMPINAS;
		case "recife" || "rec":
			return IATACodeAirport.RECIFE;
		case "curitiba" || "cwb":
			return IATACodeAirport.CURITIBA;
		case "belem" || "bel":
			return IATACodeAirport.BELEM;
		case "vitoria" || "vix":
			return IATACodeAirport.VITORIA;
		case "santos dumont" || "sdu":
			return IATACodeAirport.SANTOS_DUMONT;
		case "cuiaba" || "cgb":
			return IATACodeAirport.CUIABA;
		case "campo grande" || "cgr":
			return IATACodeAirport.CAMPO_GRANDE;
		case "fortaleza" || "for":
			return IATACodeAirport.FORTALEZA;
		case "macapa" || "mcp":
			return IATACodeAirport.MACAPA;
		case "maringa" || "mgf":
			return IATACodeAirport.MARINGA;
		case "goiania" || "gyn":
			return IATACodeAirport.GOIANIA;
		case "navegantes" || "nvt":
			return IATACodeAirport.NAVEGANTES;
		case "manaus" || "mao":
			return IATACodeAirport.MANAUS;
		case "natal" || "nat":
			return IATACodeAirport.NATAL;
		case "porto seguro" || "bps":
			return IATACodeAirport.PORTO_SEGURO;
		case "maceio" || "mcz":
			return IATACodeAirport.MACEIO;
		case "palmas" || "pmw":
			return IATACodeAirport.PALMAS;
		case "sao luis" || "slz":
			return IATACodeAirport.SAO_LUIS;
		case "guarulhos" || "gru":
			return IATACodeAirport.GUARULHOS;
		case "londrina" || "ldb":
			return IATACodeAirport.LONDRINA;
		case "porto velho" || "pvh":
			return IATACodeAirport.PORTO_VELHO;
		case "rio branco" || "rbr":
			return IATACodeAirport.RIO_BRANCO;
		case "joinville" || "joi":
			return IATACodeAirport.JOINVILLE;
		case "uberlandia" || "udi":
			return IATACodeAirport.UBERLANDIA;
		case "caxias do sul" || "cxj":
			return IATACodeAirport.CAXIAS_DO_SUL;
		case "foz do iguacu" || "igu":
			return IATACodeAirport.FOZ_DO_IGUACU;
		case "teresina" || "the":
			return IATACodeAirport.TERESINA;
		case "aracaju" || "aju":
			return IATACodeAirport.ARACAJU;
		case "joao pessoa" || "jpa":
			return IATACodeAirport.JOAO_PESSOA;
		case "petrolina" || "pnz":
			return IATACodeAirport.PETROLINA;
		case "confins" || "cnf":
			return IATACodeAirport.CONFINS;
		case "boa vista" || "bvb":
			return IATACodeAirport.BOA_VISTA;
		case "campina grande" || "cpv":
			return IATACodeAirport.CAMPINA_GRANDE;
		case "santarem" || "stm":
			return IATACodeAirport.SANTAREM;
		case "ilheus" || "ios":
			return IATACodeAirport.ILHEUS;
		case "juazeiro do norte" || "jdo":
			return IATACodeAirport.JUAZEIRO_DO_NORTE;
		case "imperatriz" || "imp":
			return IATACodeAirport.IMPERATRIZ;
		case "chapeco" || "xap":
			return IATACodeAirport.CHAPECO;
		case "maraba" || "mab":
			return IATACodeAirport.MARABA;
		case "cruzeiro do sul" || "czs":
			return IATACodeAirport.CRUZEIRO_DO_SUL;
		case "presidente prudente" || "ppb":
			return IATACodeAirport.PRESIDENTE_PRUDENTE;
		case "cabo frio" || "cfb":
			return IATACodeAirport.CABO_FRIO;
		case "fernando de noronha" || "fen":
			return IATACodeAirport.FERNANDO_DE_NORONHA;
		case "bauru" || "jtc":
			return IATACodeAirport.BAURU;
		case "monte claros" || "moc":
			return IATACodeAirport.MONTE_CLAROS;
		default:
			return IATACodeAirport.GUARULHOS;
	}
};
