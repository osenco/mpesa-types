import * as request from 'request-promise-native';

import { Environment } from './types';

export const generateToken = async (
  environment: Environment,
  consumerKey: string,
  consumerSecret: string
) => {
  try {
    return await request.get(
      `https://${getEnvPath(environment)}.safaricom.co.ke/oauth/v1/generate`,
      {
        auth: { user: consumerKey, pass: consumerSecret },
        json: true,
        qs: { grant_type: 'client_credentials' }
      }
    );
  } catch (error) {
    throw new Error(error.response.statusMessage);
  }
};

export const mpesaExpressRequest = async (
  environment: Environment,
  accessToken: string,
  BusinessShortCode: number,
  Password: string,
  Timestamp: string,
  TransactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline',
  Amount: number,
  PartyA: number,
  PartyB: number,
  PhoneNumber: number,
  CallBackURL: string,
  AccountReference: string,
  TransactionDesc: string
) => {
  try {
    return await request.post(
      `https://${getEnvPath(
        environment
      )}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
      {
        body: {
          AccountReference,
          Amount,
          BusinessShortCode,
          CallBackURL,
          PartyA,
          PartyB,
          Password,
          PhoneNumber,
          Timestamp,
          TransactionDesc,
          TransactionType
        },
        headers: { Authorization: `Bearer ${accessToken}` },
        json: true
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const mpesaExpressQuery = async (
  environment: Environment,
  accessToken: string,
  BusinessShortCode: number,
  Password: string,
  Timestamp: string,
  CheckoutRequestID: string
) => {
  try {
    return await request.post(
      `https://${getEnvPath(
        environment
      )}.safaricom.co.ke/mpesa/stkpushquery/v1/query`,
      {
        body: {
          BusinessShortCode,
          CheckoutRequestID,
          Password,
          Timestamp
        },
        headers: { Authorization: `Bearer ${accessToken}` },
        json: true
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const c2bRegisterUrl = async (
  environment: Environment,
  accessToken: string,
  ValidationURL: string,
  ConfirmationURL: string,
  ResponseType: 'Canceled' | 'Completed',
  ShortCode: number
) => {
  try {
    return await request.post(
      `https://${getEnvPath(
        environment
      )}.safaricom.co.ke/mpesa/c2b/v1/registerurl`,
      {
        body: {
          ConfirmationURL,
          ResponseType,
          ShortCode,
          ValidationURL
        },
        headers: { Authorization: `Bearer ${accessToken}` },
        json: true
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const c2bSimulateTransaction = async (
  accessToken: string,
  CommandID: string,
  Amount: number,
  Msisdn: number,
  BillRefNumber: string,
  ShortCode: number
) => {
  try {
    return await request.post(
      'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate',
      {
        body: {
          Amount,
          BillRefNumber,
          CommandID,
          Msisdn,
          ShortCode
        },
        headers: { Authorization: `Bearer ${accessToken}` },
        json: true
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const b2cPaymentRequest = async (
  environment: Environment,
  accessToken: string,
  InitiatorName: string,
  SecurityCredential: string,
  CommandID: 'SalaryPayment' | 'BusinessPayment' | 'PromotionPayment',
  Amount: number,
  PartyA: number,
  PartyB: number,
  Remarks: string,
  QueueTimeOutURL: string,
  ResultURL: string,
  Occassion: string
) => {
  try {
    return await request.post(
      `https://${getEnvPath(
        environment
      )}.safaricom.co.ke/mpesa/b2c/v1/paymentrequest`,
      {
        body: {
          Amount,
          CommandID,
          InitiatorName,
          Occassion,
          PartyA,
          PartyB,
          QueueTimeOutURL,
          Remarks,
          ResultURL,
          SecurityCredential
        },
        headers: { Authorization: `Bearer ${accessToken}` },
        json: true
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const accountBalanceRequest = async (
  environment: Environment,
  accessToken: string,
  CommandID: 'AccountBalance',
  PartyA: number,
  IdentifierType: 1 | 2 | 4,
  Remarks: string,
  Initiator: string,
  SecurityCredential: string,
  QueueTimeOutURL: string,
  ResultURL: string
) => {
  try {
    return await request.post(
      `https://${getEnvPath(
        environment
      )}.safaricom.co.ke/mpesa/accountbalance/v1/query`,
      {
        body: {
          CommandID,
          IdentifierType,
          Initiator,
          PartyA,
          QueueTimeOutURL,
          Remarks,
          ResultURL,
          SecurityCredential
        },
        headers: { Authorization: `Bearer ${accessToken}` },
        json: true
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const transactionStatusRequest = async (
  environment: Environment,
  accessToken: string,
  CommandID: 'TransactionStatusQuery',
  PartyA: number,
  IdentifierType: 1 | 2 | 4,
  Remarks: string,
  Initiator: string,
  SecurityCredential: string,
  QueueTimeOutURL: string,
  ResultURL: string,
  TransactionID: string,
  Occasion: string
) => {
  try {
    return await request.post(
      `https://${getEnvPath(
        environment
      )}.safaricom.co.ke/mpesa/transactionstatus/v1/query`,
      {
        body: {
          CommandID,
          IdentifierType,
          Initiator,
          Occasion,
          PartyA,
          QueueTimeOutURL,
          Remarks,
          ResultURL,
          SecurityCredential,
          TransactionID
        },
        headers: { Authorization: `Bearer ${accessToken}` },
        json: true
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const reversalRequest = async (
  environment: Environment,
  accessToken: string,
  CommandID: 'TransactionReversal',
  ReceiverParty: number,
  ReceiverIdentifierType: 11,
  Remarks: string,
  Initiator: string,
  SecurityCredential: string,
  QueueTimeOutURL: string,
  ResultURL: string,
  TransactionID: string,
  Occasion: string
) => {
  try {
    return await request.post(
      `https://${getEnvPath(
        environment
      )}.safaricom.co.ke/mpesa/reversal/v1/request`,
      {
        body: {
          CommandID,
          Initiator,
          Occasion,
          QueueTimeOutURL,
          ReceiverIdentifierType,
          ReceiverParty,
          Remarks,
          ResultURL,
          SecurityCredential,
          TransactionID
        },
        headers: { Authorization: `Bearer ${accessToken}` },
        json: true
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getEnvPath = (
  environment: 'production' | 'sandbox'
): 'api' | 'sandbox' => (environment === 'production' ? 'api' : 'sandbox');