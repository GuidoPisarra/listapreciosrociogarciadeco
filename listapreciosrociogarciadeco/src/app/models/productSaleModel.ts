export class ProductSaleModel {
  public idProduct!: number;
  public quantity!: number;
  public price!: number;
  public typePayment!: string;
  public id_negocio!: number;
  public id_persona!: number;

  constructor(idProduct: number, quantity: number, price: number, typePayment: string) {
    this.idProduct = idProduct;
    this.quantity = quantity;
    this.price = price;
    this.typePayment = typePayment;
  }

  public setIdProduct(idProduct: number) {
    this.idProduct = idProduct;
  }

  public getIdProduct(): number {
    return this.idProduct;
  }
  public setQuantity(quantity: number) {
    this.quantity = quantity;
  }

  public getQuantity(): number {
    return this.quantity;
  }
  public setPrice(price: number) {
    this.price = price;
  }

  public getPrice(): number {
    return this.price;
  }
  public setTypePayment(typePayment: string) {
    this.typePayment = typePayment;
  }

  public getTypePayment(): string {
    return this.typePayment;
  }

  public setIdNegocio(id_negocio: number): void {
    this.id_negocio = id_negocio;
  }

  public setPersona(id_persona: number): void {
    this.id_persona = id_persona;
  }

}
