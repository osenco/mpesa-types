import Mpesa from "./mpesa"

export const mpesa = new Mpesa();

export async function stkPush(phone: number, amount: number) {
    return mpesa.stkPush(phone, amount)
}