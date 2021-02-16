import axios from "axios";

export default class Mpesa {
	public confirmUrl: string;
	public validateUrl: string;
	public config: object;
	public http = axios.create({
		timeout: 10,
		headers: {
			common: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		},
	});

	public configure(c: any) {
		this.config = c;
	}

	public set validate_url(v: string) {
		this.validateUrl = v;
	}

	public set confirm_url(v: string) {
		this.confirmUrl = v;
	}

	/**
	 * getToken
	 */
	public async getToken() {
		const token = "token";
		if (token) {
			this.http.defaults.headers.common = {
				Authorization: `Bearer ${token}`,
			};
		}

		return token;
	}

	/**
	 * stkPush
	 */
	public async stkPush(phone: number, amount: number) {
		this.getToken().then((token) => {
			return this.http
				.post(`/saf`, {
					phone: phone,
				})
				.then((res) => res.data);
		});
	}
}
