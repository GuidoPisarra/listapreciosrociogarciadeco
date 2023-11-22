export class IncomesExpensesModel{
  public incomes! :number;
  public egress! :number;
  public diference! :number;

  constructor( incomes: number, egress: number, diference: number){
    this.incomes = incomes;
    this.egress = egress;
    this.diference = diference;
  }

  public getIncomes(): number{
    return this.incomes;
  }

  public getEgress(): number{
    return this.egress;
  }

  public getDiference(): number{
    return this.diference;
  }
}
