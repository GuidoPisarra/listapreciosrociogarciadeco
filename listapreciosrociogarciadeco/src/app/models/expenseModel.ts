export class ExpenseModel {
  public id!: number;
  public description!: string;
  public price!: number;
  public idSucursal!: number;
  public date_expense!: string;

  constructor(id: number, description: string, price: number, idSucursal: number, dateExpense: string) {
    this.id = id;
    this.description = description;
    this.price = price;
    this.idSucursal = idSucursal;
    this.date_expense = dateExpense;
  }

  public getId(): number {
    return this.id;
  }

  public getDescription(): string {
    return this.description;
  }

  public getPrice(): number {
    return this.price;
  }

  public getIdSucursal(): number {
    return this.idSucursal;
  }

  public getDateExpense(): string {
    return this.date_expense;
  }
}
