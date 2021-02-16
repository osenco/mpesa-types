import { format } from "date-fns"

import { DarajaError } from './errors';
import * as logic from './logic';
import { Environment } from './types';

/**
 *
 * This class implements the M-Pesa Daraja API methods
 */
export class Mpesa {
  private accessToken: string;
  private expiryDate;

  /**
   *
   * Creates an instance of Mpesa
   * @param {number} shortcode - organization shortcode
   * @param {string} consumerKey - app's consumer key
   * @param {string} consumerSecret - app's consumer secret
   * @param {Environment} [environment='sandbox'] - application environment
   * @memberof Mpesa
   * @constructor
   */
  constructor(
    private shortcode: number,
    private consumerKey: string,
    private consumerSecret: string,
    private environment: Environment = 'sandbox'
  ) {
    this.accessToken = '';
    this.expiryDate = format(new Date(), 'yyyy-MM-dd');
  }

  /**
   *
   * Invoke the Lipa na M-Pesa Online Payment API. Use this method to initiate
   * an online payment on behalf of a customer
   * @param {number} amount - money that the customer pays to the shortcode
   * @param {number} sender - phone number of the customer sending the money
   * @param {number} recipient - organization shortcode to receive the funds
   * @param {string} passkey - Lipa na M-Pesa Online Passkey
   * @param {('CustomerPayBillOnline' | 'CustomerBuyGoodsOnline')} transactionType -
   * transaction type that is used to identify the transaction when sending the
   * request to M-Pesa
   * @param {string} accountReference - alphanumeric parameter that is defined
   * by your system as an Identifier of the transaction for
   * CustomerPayBillOnline transaction type
   * @param {string} transactionDescription - any additional
   * information/comment that can be sent along with the request from your
   * system
   * @param {string} callbackUrl - valid secure URL that is used to receive
   * notifications from M-Pesa API and is the endpoint to which the results
   * will be sent by M-Pesa API
   * @memberof Mpesa
   * @throws {DarajaError}
   * @async
   * @example
   * mpesa.mpesaExpressRequest(
   *   100,
   *   254712345678,
   *   123456,
   *   'bfb279f9aa9bdbcf15...',
   *   'CustomerPayBillOnline',
   *   'INV001',
   *   'Regular payment',
   *   'http://callbackurl.com'
   * ).then(response => {
   *   // SUCCESS
   *   // do something with the response
   * }).catch(error => {
   *   // FAILED
   *   // handle the error
   * })
   */
  public async mpesaExpressRequest(
    amount: number,
    sender: number,
    recipient: number,
    passkey: string,
    transactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline',
    accountReference: string,
    transactionDescription: string,
    callbackUrl: string
  ) {
    try {
      const { accessToken, expiryDate } = await logic.generateToken(
        this.environment,
        this.consumerKey,
        this.consumerSecret,
        this.accessToken,
        this.expiryDate
      );
      this.accessToken = accessToken;
      this.expiryDate = expiryDate;

      return await logic.mpesaExpressRequest(
        this.environment,
        this.accessToken,
        this.shortcode,
        passkey,
        transactionType,
        amount,
        sender,
        recipient,
        callbackUrl,
        accountReference,
        transactionDescription
      );
    } catch (error) {
      throw new DarajaError(error.message);
    }
  }

  /**
   *
   * Invoke the Lipa Na M-Pesa Query Request API. Use this method to check the
   * status of a Lipa Na M-Pesa Online Payment
   * @param {string} passkey - Lipa na M-Pesa Online Passkey
   * @param {string} checkoutRequestId - global unique identifier of the
   * processed checkout transaction request
   * @see [Mpesa.mpesaExpressRequest()]{@link Mpesa#mpesaExpressRequest}
   * @memberof Mpesa
   * @throws {DarajaError}
   * @async
   * @example
   * mpesa.mpesaExpressQuery(
   *   'bfb279f9aa9bdbcf15...',
   *   'ws_CO_DMZ_123212312_2342347678234'
   * ).then(response => {
   *   // SUCCESS
   *   // do something with the response
   * }).catch(error => {
   *   // FAILED
   *   // handle the error
   * })
   */
  public async mpesaExpressQuery(passkey: string, checkoutRequestId: string) {
    try {
      const { accessToken, expiryDate } = await logic.generateToken(
        this.environment,
        this.consumerKey,
        this.consumerSecret,
        this.accessToken,
        this.expiryDate
      );
      this.accessToken = accessToken;
      this.expiryDate = expiryDate;

      return await logic.mpesaExpressQuery(
        this.environment,
        this.accessToken,
        this.shortcode,
        passkey,
        checkoutRequestId
      );
    } catch (error) {
      throw new DarajaError(error.message);
    }
  }

  /**
   *
   * Invoke the C2B Register URL API. Use this method to register validation
   * and confirmation URLs on M-Pesa
   * @param {string} validationUrl - URL that receives the validation request
   * from API upon payment submission
   * @param {string} confirmationUrl - URL that receives the confirmation
   * request from API upon payment completion
   * @param {('Completed' | 'Canceled')} responseType - specifies what is to
   * happen if for any reason the validation URL is nor reachable
   * @memberof Mpesa
   * @async
   * @example
   * mpesa.c2bRegisterUrl(
   *   'http://validationurl.com',
   *   'http://confirmationurl.com'
   *   'Completed'
   * ).then(response => {
   *   // SUCCESS
   *   // do something with the response
   * }).catch(error => {
   *   // FAILED
   *   // handle the error
   * })
   */
  public async c2bRegisterUrl(
    validationUrl: string,
    confirmationUrl: string,
    responseType: 'Completed' | 'Canceled'
  ) {
    try {
      const { accessToken, expiryDate } = await logic.generateToken(
        this.environment,
        this.consumerKey,
        this.consumerSecret,
        this.accessToken,
        this.expiryDate
      );
      this.accessToken = accessToken;
      this.expiryDate = expiryDate;

      return await logic.c2bRegisterUrl(
        this.environment,
        this.accessToken,
        this.shortcode,
        validationUrl,
        confirmationUrl,
        responseType
      );
    } catch (error) {
      throw new DarajaError(error.message);
    }
  }

  /**
   *
   * Invoke the C2B Simulate Transaction API. Use this method to simulate a
   * payment made from the client phone's STK/SIM Toolkit menu
   * @param {number} amount - amount being transacted
   * @param {number} sender - phone number initiating the C2B transaction
   * @param {string} billReference - used on CustomerPayBillOnline option only
   * and is where a customer is expected to enter a unique bill identifier,
   * e.g an Account Number
   * @memberof Mpesa
   * @throws {DarajaError}
   * @async
   * @example
   * mpesa.c2bSimulateTransaction(
   *   100,
   *   254712345678,
   *   '13123421'
   * ).then(response => {
   *   // SUCCESS
   *   // do something with the response
   * }).catch(error => {
   *   // FAILED
   *   // handle the error
   * })
   */
  public async c2bSimulateTransaction(
    amount: number,
    sender: number,
    billReference: string
  ) {
    try {
      const { accessToken, expiryDate } = await logic.generateToken(
        this.environment,
        this.consumerKey,
        this.consumerSecret,
        this.accessToken,
        this.expiryDate
      );
      this.accessToken = accessToken;
      this.expiryDate = expiryDate;

      return await logic.c2bSimulateTransaction(
        this.environment,
        this.accessToken,
        this.shortcode,
        sender,
        amount,
        billReference
      );
    } catch (error) {
      throw new DarajaError(error.message);
    }
  }

  /**
   *
   * Invoke the B2C Payment Request API. Use this method to transact between an
   * M-Pesa short code to a phone number registered on M-Pesa
   * @param {number} amount - amount of money being sent to the customer
   * @param {number} recipient - customer mobile number  to receive the amount
   * @param {string} initiatorName - username of the M-Pesa B2C account API
   * operator
   * @param {string} initiatorPassword - password of the M-Pesa B2C account API
   * operator
   * @param {('SalaryPayment' | 'BusinessPayment' | 'PromotionPayment')} commandId -
   * unique command that specifies B2C transaction type
   * @param {string} remarks - any additional information to be associated with
   * the transaction
   * @param {string} occassion - any additional information to be associated
   * with the transaction
   * @param {string} resultUrl - URL that will be used by M-Pesa to send
   * notification upon processing of the payment
   * request
   * @param {string} timeoutUrl - URL that will be used by API Proxy to send
   * notification incase the payment request is timed out while awaiting
   * processing in the queue
   * @memberof Mpesa
   * @throws {DarajaError}
   * @async
   * @example
   * mpesa.b2cPaymentRequest(
   *   100,
   *   254712345678,
   *   'initiator',
   *   'p455w0rd',
   *   'BusinessPayment',
   *   'Remarks',
   *   'Occassion',
   *   'http://resulturl.com',
   *   'http://timeouturl.com'
   * ).then(response => {
   *   // SUCCESS
   *   // do something with the response
   * }).catch(error => {
   *   // FAILED
   *   // handle the error
   * })
   */
  public async b2cPaymentRequest(
    amount: number,
    recipient: number,
    initiatorName: string,
    initiatorPassword: string,
    commandId: 'SalaryPayment' | 'BusinessPayment' | 'PromotionPayment',
    remarks: string,
    occassion: string,
    resultUrl: string,
    timeoutUrl: string
  ) {
    try {
      const { accessToken, expiryDate } = await logic.generateToken(
        this.environment,
        this.consumerKey,
        this.consumerSecret,
        this.accessToken,
        this.expiryDate
      );
      this.accessToken = accessToken;
      this.expiryDate = expiryDate;

      return await logic.b2cPaymentRequest(
        this.environment,
        this.accessToken,
        this.shortcode,
        recipient,
        amount,
        commandId,
        initiatorName,
        initiatorPassword,
        remarks,
        occassion,
        timeoutUrl,
        resultUrl
      );
    } catch (error) {
      throw new DarajaError(error.message);
    }
  }

  /**
   *
   * Invoke the Account Balance Request API. Use this method to enquire the
   * balance on an M-Pesa shortcode
   * @param {(1 | 2 | 4)} identifierType - Type of organization receiving the
   * transaction. 1 - MSISDN, 2 - Till Number, 4 - Organization shortcode
   * @param {string} initiatorName - name of Initiator to initiating the
   * request
   * @param {string} initiatorPassword - password of Initiator to initiating
   * the request
   * @param {string} remarks - comments that are sent along with the
   * transaction
   * @param {string} resultUrl - path that stores information of transaction
   * @param {string} timeoutUrl - path that stores information of time out
   * transaction
   * @memberof Mpesa
   * @throws {DarajaError}
   * @async
   * @example
   * mpesa.accountBalanceRequest(
   *   4,
   *   'initiator',
   *   'p455w0rd',
   *   'Remarks',
   *   'http://resulturl.com',
   *   'http://timeouturl.com'
   * ).then(response => {
   *   // SUCCESS
   *   // do something with the response
   * }).catch(error => {
   *   // FAILED
   *   // handle the error
   * })
   */
  public async accountBalanceRequest(
    identifierType: 1 | 2 | 4,
    initiatorName: string,
    initiatorPassword: string,
    remarks: string,
    resultUrl: string,
    timeoutUrl: string
  ) {
    try {
      const { accessToken, expiryDate } = await logic.generateToken(
        this.environment,
        this.consumerKey,
        this.consumerSecret,
        this.accessToken,
        this.expiryDate
      );
      this.accessToken = accessToken;
      this.expiryDate = expiryDate;

      return await logic.accountBalanceRequest(
        this.environment,
        this.accessToken,
        this.shortcode,
        identifierType,
        initiatorName,
        initiatorPassword,
        remarks,
        timeoutUrl,
        resultUrl
      );
    } catch (error) {
      throw new DarajaError(error.message);
    }
  }

  /**
   *
   * Invoke the Transaction Status Request API. Use this method to check the
   * transaction status
   * @param {string} transactionId - unique identifier to identify a
   * transaction on M-Pesa
   * @param {(1 | 2 | 4)} identifierType - type of organization receiving the
   * transaction
   * @param {string} initiatorName - name of Initiator initiating the request
   * @param {string} initiatorPassword - password of Initiator initiating the
   * request
   * @param {string} remarks - comments that are sent along with the
   * transaction
   * @param {string} occassion - optional parameter
   * @param {string} resultUrl - path that stores information of transaction
   * @param {string} timeoutUrl - path that stores information of time out
   * transaction
   * @memberof Mpesa
   * @async
   * @example
   * mpesa.transactionStatusRequest(
   *   'MX000000000',
   *   4,
   *   'initiator',
   *   'p455w0rd',
   *   'Remarks',
   *   'Occassion',
   *   'http://resulturl.com',
   *   'http://timeouturl.com'
   * ).then(response => {
   *   // SUCCESS
   *   // do something with the response
   * }).catch(error => {
   *   // FAILED
   *   // handle the error
   * })
   */
  public async transactionStatusRequest(
    transactionId: string,
    identifierType: 1 | 2 | 4,
    initiatorName: string,
    initiatorPassword: string,
    remarks: string,
    occassion: string,
    resultUrl: string,
    timeoutUrl: string
  ) {
    try {
      const { accessToken, expiryDate } = await logic.generateToken(
        this.environment,
        this.consumerKey,
        this.consumerSecret,
        this.accessToken,
        this.expiryDate
      );
      this.accessToken = accessToken;
      this.expiryDate = expiryDate;

      return await logic.transactionStatusRequest(
        this.environment,
        this.accessToken,
        this.shortcode,
        identifierType,
        initiatorName,
        initiatorPassword,
        transactionId,
        remarks,
        occassion,
        timeoutUrl,
        resultUrl
      );
    } catch (error) {
      throw new DarajaError(error.message);
    }
  }

  /**
   *
   * Invoke the Reversal Request API. Use this method to reverse an M-Pesa
   * transaction
   * @param {string} transactionId - unique identifier to identify a
   * transaction on M-Pesa
   * @param {string} initiatorName - name of initiator initiating the request
   * @param {string} initiatorPassword - password of the initiator initiating
   * the request
   * @param {string} remarks - comments that are sent along with the
   * transaction
   * @param {string} occassion - optional parameter
   * @param {string} resultUrl - path that stores information of the
   * transaction
   * @param {string} timeoutUrl - path that stores information of time out
   * transaction
   * @memberof Mpesa
   * @throws {DarajaError}
   * @async
   * @example
   * mpesa.reversalRequest(
   *   'MX000000000',
   *   'initiator',
   *   'p455w0rd',
   *   'Remarks',
   *   'Occassion',
   *   'http://resulturl.com',
   *   'http://timeouturl.com'
   * ).then(response => {
   *   // SUCCESS
   *   // do something with the response
   * }).catch(error => {
   *   // FAILED
   *   // handle the error
   * })
   */
  public async reversalRequest(
    transactionId: string,
    initiatorName: string,
    initiatorPassword: string,
    remarks: string,
    occassion: string,
    resultUrl: string,
    timeoutUrl: string
  ) {
    try {
      const { accessToken, expiryDate } = await logic.generateToken(
        this.environment,
        this.consumerKey,
        this.consumerSecret,
        this.accessToken,
        this.expiryDate
      );
      this.accessToken = accessToken;
      this.expiryDate = expiryDate;

      return await logic.reversalRequest(
        this.environment,
        this.accessToken,
        this.shortcode,
        initiatorName,
        initiatorPassword,
        transactionId,
        remarks,
        occassion,
        timeoutUrl,
        resultUrl
      );
    } catch (error) {
      throw new DarajaError(error.message);
    }
  }
}