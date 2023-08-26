import { InferModel, relations } from "drizzle-orm";
import {
  bigint,
  bigserial,
  json,
  pgTable,
  timestamp,
} from "drizzle-orm/pg-core";
import { housingFeeBillsTable } from "./housing-fee-bill.schema";

export const housingFeePaymentsTable = pgTable("housing_fee_payments", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  housing_fee_bill_id: bigint("housing_fee_bill_id", { mode: "number" })
    .notNull()
    .unique()
    .references(() => housingFeeBillsTable.id, { onDelete: "restrict" }),
  payment_gateway_charge_response: json("payment_gateway_response")
    .notNull()
    .$type<XenditChargeResponse>(),
  payment_gateway_callback_response: json(
    "payment_gateway_callback_response"
  ).$type<XenditCallbackResponse>(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  paid_at: timestamp("paid_at"),
  expired_at: timestamp("expired_at"),
});

export type HousingFeePayment = InferModel<typeof housingFeePaymentsTable>;

export const housingFeePaymentsRelations = relations(
  housingFeePaymentsTable,
  ({ one }) => ({
    housingFeeBill: one(housingFeeBillsTable, {
      fields: [housingFeePaymentsTable.housing_fee_bill_id],
      references: [housingFeeBillsTable.id],
    }),
  })
);

type XenditEWalletChargeResponse = {
  id: string;
  business_id: string;
  reference_id: string;
  status: string;
  currency: string;
  charge_amount: number;
  capture_amount: number;
  refunded_amount: any;
  checkout_method: string;
  channel_code: string;
  channel_properties: {
    success_redirect_url: string;
  };
  actions: {
    desktop_web_checkout_url: any;
    mobile_web_checkout_url: any;
    mobile_deeplink_checkout_url: string;
    qr_checkout_string: string;
  };
  is_redirect_required: boolean;
  callback_url: string;
  created: string;
  updated: string;
  void_status: any;
  voided_at: any;
  capture_now: boolean;
  customer_id: any;
  payment_method_id: any;
  failure_code: any;
  basket: any;
  metadata: {
    branch_code: string;
  };
};

type XenditVirtualAccountChargeResponse = {
  id: string;
  external_id: string;
  owner_id: string;
  bank_code: string;
  merchant_code: string;
  account_number: string;
  name: string;
  is_single_use: boolean;
  is_closed: boolean;
  expiration_date: string;
  status: string;
  currency: string;
  country: string;
};

type XenditChargeResponse =
  | XenditEWalletChargeResponse
  | XenditVirtualAccountChargeResponse;

type XenditEWalletCallbackSuccessResponse = {
  event: string;
  business_id: string;
  created: string;
  data: {
    id: string;
    business_id: string;
    reference_id: string;
    status: string;
    currency: string;
    charge_amount: number;
    capture_amount: number;
    checkout_method: string;
    channel_code: string;
    channel_properties: {
      success_redirect_url: string;
    };
    actions: {
      desktop_web_checkout_url: any;
      mobile_web_checkout_url: any;
      mobile_deeplink_checkout_url: string;
      qr_checkout_string: string;
    };
    is_redirect_required: boolean;
    callback_url: string;
    created: string;
    updated: string;
    voided_at: any;
    capture_now: boolean;
    customer_id: any;
    payment_method_id: any;
    failure_code: any;
    basket: any;
    metadata: {
      branch_code: string;
    };
  };
};

type XenditEWalletCallbackFailedResponse = {
  event: string;
  business_id: string;
  created: string;
  data: {
    id: string;
    business_id: string;
    reference_id: string;
    status: string;
    currency: string;
    charge_amount: number;
    capture_amount: number;
    refunded_amount: any;
    checkout_method: string;
    channel_code: string;
    channel_properties: {
      success_redirect_url: string;
    };
    actions: {
      desktop_web_checkout_url: any;
      mobile_web_checkout_url: any;
      mobile_deeplink_checkout_url: string;
      qr_checkout_string: string;
    };
    is_redirect_required: boolean;
    callback_url: string;
    created: string;
    updated: string;
    void_status: any;
    voided_at: any;
    capture_now: boolean;
    customer_id: any;
    payment_method_id: any;
    failure_code: string;
    basket: any;
    metadata: {
      branch_code: string;
    };
  };
};

type XenditVirtualAccountCallbackSuccessResponse = {
  id: string;
  payment_id: string;
  callback_virtual_account_id: string;
  owner_id: string;
  external_id: string;
  account_number: string;
  bank_code: string;
  transaction_timestamp: string;
  amount: number;
  merchant_code: string;
  currency: string;
  country: string;
  sender_name: string;
  payment_detail: {
    payment_interface: string;
    remark: string;
    reference: string;
    sender_account_number: string;
    sender_channel_code: string;
    sender_name: string;
    transfer_method: string;
  };
};

type XenditCallbackResponse =
  | XenditEWalletCallbackSuccessResponse
  | XenditEWalletCallbackFailedResponse
  | XenditVirtualAccountCallbackSuccessResponse;
