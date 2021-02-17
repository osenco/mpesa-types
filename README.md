# mpesa-types
MPESA Node Library

```js
import useMpesa from "@osenco/mpesa"

const { mpesa, stkPush, registerUrls, checkBalance } = useMpesa();

mpesa.configure({
  env: "production",
  shortcode: 714777,
  headoffice: 717477
})

const {
      MerchantRequestID: merchantRequestId,
      CheckoutRequestID: checkoutRequestId
    } = await stkPush(254705459494, 10)

    // save MerchantRequestID to DB
```