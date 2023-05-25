import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { designFilterOptions, colorFilterOptions } from "../../data/filter.data";
import { DesignFilter, ColorFilter, Filters } from '../../models/filters';


@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent implements OnInit , OnDestroy{
  @Output() filterDataEvent = new EventEmitter<{ design: DesignFilter[], color: ColorFilter[] }>();
  filterButtonText: string = "Filter";
  filterButtonFlag: boolean = true;
  closeFilterButtonFlag: boolean = false;
  designFilterOptions: Filters[] = [];
  colorFilterOptions: Filters[] = [];
  designFilter: DesignFilter[] = [];
  colorFilter: ColorFilter[] = [];

  ngOnInit(): void {
    const designs = sessionStorage.getItem("designFilters") || '';
    const colors = sessionStorage.getItem("colorFilters") || '';

    if (designs === '' && colors === '') {
      this.designFilterOptions = [...designFilterOptions];
      this.colorFilterOptions = [...colorFilterOptions];
      sessionStorage.setItem("designFilters", JSON.stringify(this.designFilterOptions));
      sessionStorage.setItem("colorFilters", JSON.stringify(this.colorFilterOptions));
    } else {
      this.designFilterOptions = [...JSON.parse(designs)];
      this.colorFilterOptions = [...JSON.parse(colors)];
    }
  }

  toggleButtonText() {
    this.filterButtonText = this.filterButtonText === "Filter" ? "Close" : "Filter";
    this.closeFilterButtonFlag = !this.closeFilterButtonFlag;
  }

  updateSessionStorage() {
    sessionStorage.setItem("designFilters", JSON.stringify(this.designFilterOptions));
    sessionStorage.setItem("colorFilters", JSON.stringify(this.colorFilterOptions));
  }

  getDesignSelectedOptions(options: Filters[]) {
    return options.filter(option => option.checked)
      .map(option => ({ Design: option.value }));
  }

  getColorSelectedOptions(options: Filters[]) {
    return options.filter(option => option.checked)
      .map(option => ({ Color: option.value }));
  }

  applyFilters() {
    this.updateSessionStorage();

    const selectedDesignOptions = this.getDesignSelectedOptions(this.designFilterOptions);
    const selectedColorOptions = this.getColorSelectedOptions(this.colorFilterOptions);

    const filteredDesign = [...selectedDesignOptions];
    const filteredColor = [...selectedColorOptions];

    this.filterDataEvent.emit({ design: filteredDesign, color: filteredColor });
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem("designFilters");
    sessionStorage.removeItem("colorFilters");
  }
}
