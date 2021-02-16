import * as constants from 'constants';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import * as moment from 'moment';

import * as api from './api';
import { Environment } from './types';

export const generateToken = async (
  environment: Environment,
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  expiryDate: moment.Moment
) => {
  try {
    if (moment().isBefore(expiryDate)) {
      return { accessToken, expiryDate };
    }
    const { access_token, expires_in } = await api.generateToken(
      environment,
      consumerKey,
      consumerSecret
    );
    return {
      accessToken: access_token,
      expiryDate: moment().add(expires_in, 'seconds')
    };
  } catch (error) {
    throw error;
  }
};

export const mpesaExpressRequest = async (
  environment: Environment,
  accessToken: string,
  shortcode: number,
  passkey: string,
  transactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline',
  amount: number,
  sender: number,
  recipient: number,
  callbackUrl: string,
  accountReference: string,
  transactionDescription: string
) => {
  const timestamp = moment().format('YYYYMMDDHHmmss');
  try {
    const {
      MerchantRequestID: merchantRequestId,
      CheckoutRequestID: checkoutRequestId
    } = await api.mpesaExpressRequest(
      environment,
      accessToken,
      shortcode,
      Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64'),
      timestamp,
      transactionType,
      amount,
      sender,
      recipient,
      sender,
      callbackUrl,
      accountReference,
      transactionDescription
    );
    return { merchantRequestId, checkoutRequestId };
  } catch (error) {
    throw error;
  }
};

export const mpesaExpressQuery = async (
  environment: Environment,
  accessToken: string,
  shortcode: number,
  passkey: string,
  checkoutRequestId: string
) => {
  const timestamp = moment().format('YYYYMMDDHHmmss');
  try {
    const {
      ResultCode: resultCode,
      ResultDesc: resultDescription
    } = await api.mpesaExpressQuery(
      environment,
      accessToken,
      shortcode,
      Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64'),
      timestamp,
      checkoutRequestId
    );
    return { resultCode, resultDescription };
  } catch (error) {
    throw error;
  }
};

export const c2bRegisterUrl = async (
  environment: Environment,
  accessToken: string,
  shortcode: number,
  validationUrl: string,
  confirmationUrl: string,
  responseType: 'Completed' | 'Canceled'
) => {
  try {
    const {
      ResponseDescription: responseDescription
    } = await api.c2bRegisterUrl(
      environment,
      accessToken,
      validationUrl,
      confirmationUrl,
      responseType,
      shortcode
    );
    return { responseDescription };
  } catch (error) {
    throw error;
  }
};

export const c2bSimulateTransaction = async (
  environment: Environment,
  accessToken: string,
  shortcode: number,
  sender: number,
  amount: number,
  billReference: string
) => {
  if (environment !== 'sandbox') {
    throw new Error('Cannot simulate on production environment');
  }
  try {
    const {
      ConversationID: conversationId,
      OriginatorCoversationID: originatorConversationId,
      ResponseDescription: responseDescription
    } = await api.c2bSimulateTransaction(
      accessToken,
      'CustomerPayBillOnline',
      amount,
      sender,
      billReference,
      shortcode
    );

    return { conversationId, originatorConversationId, responseDescription };
  } catch (error) {
    throw error;
  }
};

export const b2cPaymentRequest = async (
  environment: Environment,
  accessToken: string,
  shortcode: number,
  recipient: number,
  amount: number,
  commandId: 'SalaryPayment' | 'BusinessPayment' | 'PromotionPayment',
  initiatorName: string,
  initiatorPassword: string,
  remarks: string,
  occassion: string,
  timeoutUrl: string,
  resultUrl: string
) => {
  try {
    const {
      ConversationID: conversationId,
      OriginatorConversationID: originatorConversationId,
      ResponseDescription: responseDescription
    } = await api.b2cPaymentRequest(
      environment,
      accessToken,
      initiatorName,
      generateSecurityCredential(environment, initiatorPassword),
      commandId,
      amount,
      shortcode,
      recipient,
      remarks,
      timeoutUrl,
      resultUrl,
      occassion
    );

    return { conversationId, originatorConversationId, responseDescription };
  } catch (error) {
    throw error;
  }
};

export const accountBalanceRequest = async (
  environment: Environment,
  accessToken: string,
  shortcode: number,
  identifierType: 1 | 2 | 4,
  initiatorName: string,
  initiatorPassword: string,
  remarks: string,
  timeoutUrl: string,
  resultUrl: string
) => {
  try {
    const {
      ConversationID: conversationId,
      OriginatorConversationID: originatorConversationId,
      ResponseDescription: responseDescription
    } = await api.accountBalanceRequest(
      environment,
      accessToken,
      'AccountBalance',
      shortcode,
      identifierType,
      remarks,
      initiatorName,
      generateSecurityCredential(environment, initiatorPassword),
      timeoutUrl,
      resultUrl
    );

    return { conversationId, originatorConversationId, responseDescription };
  } catch (error) {
    throw error;
  }
};

export const transactionStatusRequest = async (
  environment: Environment,
  accessToken: string,
  shortcode: number,
  identifierType: 1 | 2 | 4,
  initiatorName: string,
  initiatorPassword: string,
  transactionId: string,
  remarks: string,
  occassion: string,
  timeoutUrl: string,
  resultUrl: string
) => {
  try {
    const {
      ConversationID: conversationId,
      OriginatorConversationID: originatorConversationId,
      ResponseDescription: responseDescription
    } = await api.transactionStatusRequest(
      environment,
      accessToken,
      'TransactionStatusQuery',
      shortcode,
      identifierType,
      remarks,
      initiatorName,
      generateSecurityCredential(environment, initiatorPassword),
      timeoutUrl,
      resultUrl,
      transactionId,
      occassion
    );

    return { conversationId, originatorConversationId, responseDescription };
  } catch (error) {
    throw error;
  }
};

export const reversalRequest = async (
  environment: Environment,
  accessToken: string,
  shortcode: number,
  initiatorName: string,
  initiatorPassword: string,
  transactionId: string,
  remarks: string,
  occassion: string,
  timeoutUrl: string,
  resultUrl: string
) => {
  try {
    const {
      ConversationID: conversationId,
      OriginatorConversationID: originatorConversationId,
      ResponseDescription: responseDescription
    } = await api.reversalRequest(
      environment,
      accessToken,
      'TransactionReversal',
      shortcode,
      11,
      remarks,
      initiatorName,
      generateSecurityCredential(environment, initiatorPassword),
      timeoutUrl,
      resultUrl,
      transactionId,
      occassion
    );

    return { conversationId, originatorConversationId, responseDescription };
  } catch (error) {
    throw error;
  }
};

const generateSecurityCredential = (
  environment: Environment,
  password: string
): string =>
  crypto
    .publicEncrypt(
      {
        key: fs.readFileSync(
          path.join(
            __dirname,
            '..',
            '..',
            'certificates',
            `${environment}.cer`
          ),
          'utf8'
        ),
        padding: constants.RSA_PKCS1_PADDING
      },
      Buffer.from(password)
    )
    .toString('base64');