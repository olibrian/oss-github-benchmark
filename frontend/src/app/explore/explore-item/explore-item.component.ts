import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService, IData} from 'src/app/data.service';
import {IInstitution} from 'src/app/interfaces/institution';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';

const sortState: Sort = {active: 'name', direction: 'desc'};

@Component({
  selector: 'app-explore-item',
  templateUrl: './explore-item.component.html',
  styleUrls: ['./explore-item.component.scss']
})

export class ExploreItemComponent implements OnInit, AfterViewInit {
  item: IInstitution;
  displayedColumns: string[] = ['name', 'num_commits', 'num_contributors', 'num_watchers'];
  @Input() data: IData;
  dataSource = new MatTableDataSource();

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
    this.sort = new MatSort;
  }

  ngOnInit(): void {
    this.dataService.loadData().then( data => {
      const itemName = this.route.snapshot.params.itemName;
      const institutions = Object.entries(data.jsonData).reduce( (previousValue, currentValue) => {
        const [key, value] = currentValue;
        return previousValue.concat(value);
      }, []);
      this.item = institutions.filter( inst => inst.name === itemName)[0];
      this.dataSource = new MatTableDataSource(this.item.repos);
    });
  }

  navigateTo(url: string): void {
    window.open(url, "_blank");
  }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource(this.item.repos);
    this.dataSource.sort = this.sort;

    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
  }
}