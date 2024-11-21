import { TransactionDocument, TransactionViewModel } from "./models/transactions.model";

export class TransactionViewDto {
  coin: string;
  quantity: string;
  price_per_coin: string;
  note: string;
  total: string;
  operation: string;
  user_id: string;
  date: string;
  id: string;

  constructor(model: TransactionDocument) {
    this.coin = model.coin;
    this.quantity = model.quantity;
    this.price_per_coin = model.price_per_coin;
    this.note = model.note;
    this.total = model.total;
    this.operation = model.operation;
    this.user_id = model.user_id;
    this.date = model.date;
    this.id = model._id.toString();
  }

  static mapToView(transaction: TransactionDocument): TransactionViewModel {
    return new TransactionViewDto(transaction);
  }

  static mapToViewArray(transactions: TransactionDocument[]): TransactionViewModel[] {
    return transactions.map((transaction) => this.mapToView(transaction));
  }
}
