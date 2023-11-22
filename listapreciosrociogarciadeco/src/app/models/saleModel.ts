export class SaleModel {
  public id!: number;
  public id_sale!: number;
  public id_product!: number;
  public quantity!: number;
  public amount!: number;
  public sale_product_date!: string;
  public type_payment!: string;
  public description!: string;


  constructor(id: number, idSale: number, idProduct: number, quantity: number, amount: number, date: string, typePayment: string, descriptionProduct: string) {
    this.id = id;
    this.id_sale = idSale;
    this.id_product = idProduct;
    this.quantity = quantity;
    this.amount = amount;
    this.sale_product_date = date;
    this.type_payment = typePayment;
    this.description = descriptionProduct;
  }


  public getIdSaleProduct(): number {
    return this.id;
  }

  public getIdSale(): number {
    return this.id;
  }

  public getIdProduct(): number {
    return this.id_product;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getDate(): string {
    return this.sale_product_date;
  }

  public getTypePayment(): string {
    return this.type_payment;
  }

  public getDescriptinProduct(): string {
    return this.description;
  }

}

