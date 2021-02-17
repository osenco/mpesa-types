import Mpesa from "./mpesa";

export default function () {
	const mpesa = new Mpesa();

	function stkPush(
		phone: number,
		amount: number,
		reference: string,
		details: string = "STK Push"
	) {
		return mpesa.stkPush(phone, amount, reference, details);
	}

    function registerUrls(response:string = "Cancelled") {
        return mpesa.registerUrls(response)
    }

	return { mpesa, stkPush, registerUrls };
}
