import axios from "axios";
import * as constants from "constants";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

import { format } from "date-fns";
import { DarajaError } from "./errors";

export default class Mpesa {
	private path: string;
	private credential: string;
	private config: {
		consumerKey: any;
		consumerSecret: any;
		shortcode: number;
		passkey: any;
		callbackUrl: any;
		headoffice: number;
		type: number;
		password: any;
		confirmationUrl: any;
		validationUrl: any;
		username: any;
		timeoutUrl: any;
		resultUrl: any;
	};

	public http = axios.create({
		timeout: 10,
		headers: {
			common: {
				Accept: "application/json",
				"Content-Type": "application/json",
				WithCredentials: true,
			},
		},
	});

	public configure(
		c: any = {
			env: "sandbox",
			type: 4,
			shortcode: 1,
			headoffice: 1,
			passkey: "",
			consumerKey: "",
			consumerSecret: "",
			username: "",
			password: "",
		}
	) {
		this.config = c;
		this.path = c.env === "production" ? "api" : "sandbox";
		this.credential = crypto
			.publicEncrypt(
				{
					key: fs.readFileSync(
						path.join(
							__dirname,
							"..",
							"..",
							"certs",
							`${c.env}.cer`
						),
						"utf8"
					),
					padding: constants.RSA_PKCS1_PADDING,
				},
				Buffer.from(c.password)
			)
			.toString("base64");
	}

	public async getToken() {
		try {
			const token = await this.http
				.get(`https://${this.path}.safaricom.co.ke/oauth/v1/generate`, {
					auth: {
						username: this.config.consumerKey,
						password: this.config.consumerSecret,
					},
				})
				.then((res) => res.data)
				.catch((e) => e);

			if (token) {
				this.http.defaults.headers.common = {
					Authorization: `Bearer ${token}`,
				};
			}

			return token;
		} catch (error) {
			throw new DarajaError(error.response.statusMessage);
		}
	}

	public async stkPush(
		PhoneNumber: number,
		Amount: number,
		AccountReference: string,
		TransactionDesc: string = ""
	) {
		try {
			const timestamp = format(new Date(), "yyyyMMddHHiiss");
			const password = Buffer.from(
				`${this.config.shortcode}${this.config.passkey}${timestamp}`
			).toString("base64");

			this.getToken().then(async () => {
				const res = await this.http.post(
					`https://${this.path}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
					{
						AccountReference: AccountReference,
						Amount: Amount,
						BusinessShortCode: this.config.shortcode,
						CallBackURL: this.config.callbackUrl,
						PartyA: PhoneNumber,
						PartyB: this.config.headoffice | this.config.shortcode,
						Password: password,
						PhoneNumber: PhoneNumber,
						Timestamp: timestamp,
						TransactionDesc,
						TransactionType:
							this.config.type == 4
								? "CustomerPayBillOnline"
								: "CustomerBuyGoodsOnline",
					}
				);

				return res.data;
			});
		} catch (error) {
			throw new DarajaError(error.message);
		}
	}

	public async expressQuery(CheckoutRequestID: string) {
		try {
			this.getToken().then(async () => {
				const res = await this.http.post(
					`https://${this.path}.safaricom.co.ke/mpesa/stkpushquery/v1/query`,
					{
						BusinessShortCode: this.config.shortcode,
						CheckoutRequestID: CheckoutRequestID,
						Password: this.config.password,
						Timestamp: format(new Date(), "yyyymmddhis"),
					}
				);
				return res.data;
			});
		} catch (error) {
			throw new DarajaError(error.message);
		}
	}

	public async registerUrls(ResponseType: "Canceled" | "Completed" | string) {
		try {
			this.getToken().then(async () => {
				const res = await this.http.post(
					`https://${this.path}.safaricom.co.ke/mpesa/c2b/v1/registerurl`,
					{
						ConfirmationURL: this.config.confirmationUrl,
						ResponseType: ResponseType,
						ShortCode: this.config.shortcode,
						ValidationURL: this.config.validationUrl,
					}
				);
				return res.data;
			});
		} catch (error) {
			throw new DarajaError(error.message);
		}
	}

	public async simulateC2B(
		Phone: number,
		Amount: number,
		CommandID: string,
		BillRefNumber: string
	) {
		try {
			this.getToken().then(async () => {
				const res = await this.http.post(
					"https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate",
					{
						Amount: Amount,
						BillRefNumber: BillRefNumber,
						CommandID: CommandID,
						Msisdn: Phone,
						ShortCode: this.config.shortcode,
					}
				);
				return res.data;
			});
		} catch (error) {
			throw new DarajaError(error.message);
		}
	}

	public async b2cPayment(
		Phone: number,
		Amount: number,
		CommandID:
			| "SalaryPayment"
			| "BusinessPayment"
			| "PromotionPayment"
			| string,
		Occasion: string = "",
		Remarks: string = ""
	) {
		try {
			this.getToken().then(async () => {
				const res = await this.http.post(
					`https://${this.path}.safaricom.co.ke/mpesa/b2c/v1/paymentrequest`,
					{
						Amount: Amount,
						CommandID: CommandID,
						InitiatorName: this.config.username,
						Occassion: Occasion,
						PartyA: this.config.shortcode,
						PartyB: Phone,
						QueueTimeOutURL: this.config.timeoutUrl,
						Remarks: Remarks,
						ResultURL: this.config.resultUrl,
						SecurityCredential: this.credential,
					}
				);

				return res.data;
			});
		} catch (error) {
			throw new DarajaError(error.message);
		}
	}

	public async checkBalance(
		CommandID: "AccountBalance" | string,
		Remarks: string = ""
	) {
		try {
			this.getToken().then(async () => {
				const res = await this.http.post(
					`https://${this.path}.safaricom.co.ke/mpesa/accountbalance/v1/query`,
					{
						CommandID,
						IdentifierType: this.config.type,
						Initiator: this.config.username,
						PartyA: this.config.shortcode,
						QueueTimeOutURL: this.config.timeoutUrl,
						Remarks: Remarks,
						ResultURL: this.config.resultUrl,
						SecurityCredential: this.credential,
					}
				);

				return res.data;
			});
		} catch (error) {
			throw new DarajaError(error.message);
		}
	}

	public async checkStatus(
		TransactionID: string,
		CommandID: "TransactionStatusQuery" | string,
		Remarks: string = "",
		Occasion: string = ""
	) {
		try {
			this.getToken().then(async () => {
				const res = await this.http.post(
					`https://${this.path}.safaricom.co.ke/mpesa/transactionstatus/v1/query`,
					{
						CommandID: CommandID,
						Occasion: Occasion,
						TransactionID: TransactionID,
						IdentifierType: this.config.type,
						Initiator: this.config.username,
						PartyA: this.config.shortcode,
						QueueTimeOutURL: this.config.timeoutUrl,
						Remarks: Remarks,
						ResultURL: this.config.resultUrl,
						SecurityCredential: this.credential,
					}
				);

				return res.data;
			});
		} catch (error) {
			throw new DarajaError(error.message);
		}
	}

	public async reverse(
		Phone: number,
		ReceiverIdentifierType: 11,
		TransactionID: string,
		CommandID: "TransactionReversal",
		Remarks: string = "",
		Occasion: string = ""
	) {
		try {
			this.getToken().then(async () => {
				const res = await this.http.post(
					`https://${this.path}.safaricom.co.ke/mpesa/reversal/v1/request`,
					{
						CommandID: CommandID,
						Occasion: Occasion,
						TransactionID: TransactionID,
						IdentifierType: this.config.type,
						Initiator: this.config.username,
						PartyA: this.config.shortcode,
						QueueTimeOutURL: this.config.timeoutUrl,
						Remarks: Remarks,
						ResultURL: this.config.resultUrl,
						ReceiverIdentifierType: ReceiverIdentifierType,
						ReceiverParty: Phone,
						SecurityCredential: this.credential,
					}
				);

				return res.data;
			});
		} catch (error) {
			throw new DarajaError(error.message);
		}
	}
}
