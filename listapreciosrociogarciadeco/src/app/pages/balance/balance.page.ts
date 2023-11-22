import { Observable } from 'rxjs';
import { ExpenseModel } from './../../models/expenseModel';
import { RestService } from './../../service/rest.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.page.html',
  styleUrls: ['./balance.page.scss'],
})
export class BalancePage {
  expensesIncomes: Array<any> = [];
  incomes: number = 0;
  expenses: number = 0;
  changes: number = 0;
  total: number = 0;
  dateExample: string = '';
  mes: string = '';
  anio: number = 0;

  constructor(
    private rest: RestService
  ) { }

  ionViewDidEnter() {
    this.dateExample = new Date().toString();
    this.incomes = 0;
    this.expenses = 0;
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    this.getMonthYearExpensesIncomes(month, year);
  }


  private getMonthYearExpensesIncomes(month: number, year: number) {
    const balanceMonthYear: Observable<any> = this.rest.getBalance(month + 1, year);
    balanceMonthYear.subscribe(response => {
      this.expensesIncomes.push(response['datos']);


      this.incomes = response['datos']['incomes'];
      this.expenses = response['datos']['egress'];
      this.changes = response['datos']['changes'];
      this.total = response['datos']['total'];
      this.anio = year;
      this.mes = this.getMonthName(month)
    });
  }

  viewDate(event: any) {
    let date;
    if (event.target.value !== undefined) {
      date = new Date(event.target.value);
    } else {
      date = new Date();
    }
    this.dateExample = date.toDateString();
    const month = date.getMonth();
    const year = date.getFullYear();
    this.mes = this.getMonthName(date.getMonth());
    this.getMonthYearExpensesIncomes(month, year);
  }

  getMonthName(month: number): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[month];
  }
}
