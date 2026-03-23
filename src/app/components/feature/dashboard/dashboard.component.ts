import { Component, OnInit, inject, ChangeDetectorRef, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { DashboardDTO } from '../../../models/dtos/dashboard-dto';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    private dashboardService = inject(DashboardService);
    private cdr = inject(ChangeDetectorRef);
    private el = inject(ElementRef);
    
    public dashboardData?: DashboardDTO;
    public today: Date = new Date();
    public chartPath: string = '';
    public chartLabels: string[] = [];

    @HostListener('document:click')
    onClickOutside(): void {
        if (this.showYearPicker) {
            this.showYearPicker = false;
            this.cdr.detectChanges();
        }
    }

    public selectedMonth: number = new Date().getMonth() + 1;
    public selectedYear: number = new Date().getFullYear();
    public months = [
        { value: 1, name: 'Enero' }, { value: 2, name: 'Febrero' }, { value: 3, name: 'Marzo' },
        { value: 4, name: 'Abril' }, { value: 5, name: 'Mayo' }, { value: 6, name: 'Junio' },
        { value: 7, name: 'Julio' }, { value: 8, name: 'Agosto' }, { value: 9, name: 'Septiembre' },
        { value: 10, name: 'Octubre' }, { value: 11, name: 'Noviembre' }, { value: 12, name: 'Diciembre' }
    ];

    public hoveredDay: any = null;
    public tooltipX: number = 0;
    public tooltipY: number = 0;

    public showYearPicker: boolean = false;
    public pickerYear: number = new Date().getFullYear();

    ngOnInit(): void {
        this.fetchData();
    }

    onMonthChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedMonth = +target.value;
        this.fetchData();
    }

    toggleYearPicker(): void {
        this.showYearPicker = !this.showYearPicker;
        this.pickerYear = this.selectedYear;
        this.cdr.detectChanges();
    }

    selectMonthAtPicker(month: number): void {
        this.selectedMonth = month;
        this.selectedYear = this.pickerYear;
        this.showYearPicker = false;
        this.fetchData();
    }

    prevYearPicker(): void {
        this.pickerYear--;
        this.cdr.detectChanges();
    }

    nextYearPicker(): void {
        this.pickerYear++;
        this.cdr.detectChanges();
    }

    prevMonth(): void {
        this.selectedMonth--;
        if (this.selectedMonth < 1) {
            this.selectedMonth = 12;
            this.selectedYear--;
        }
        this.fetchData();
    }

    nextMonth(): void {
        this.selectedMonth++;
        if (this.selectedMonth > 12) {
            this.selectedMonth = 1;
            this.selectedYear++;
        }
        this.fetchData();
    }

    fetchData(): void {
        this.dashboardService.getDashboard(this.selectedMonth, this.selectedYear).subscribe({
            next: (data: DashboardDTO) => {
                this.dashboardData = data;
                this.updateChart();
                this.cdr.detectChanges();
            },
            error: (err: any) => console.error('Error fetching dashboard data:', err)
        });
    }

    onChartMouseMove(event: MouseEvent): void {
        if (!this.dashboardData || !this.dashboardData.actividadDiaria.length) return;
        
        const svg = event.currentTarget as HTMLElement;
        const rect = svg.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const width = rect.width;
        
        const activity = this.dashboardData.actividadDiaria;
        const index = Math.round((x / width) * (activity.length - 1));
        
        if (index >= 0 && index < activity.length) {
            this.hoveredDay = activity[index];
            this.tooltipX = (index / (activity.length - 1)) * 100;
            
            const data = activity.map(d => d.valor);
            const max = Math.max(...data, 1);
            const val = activity[index].valor;
            const height = 180;
            const padding = 15;
            const chartHeight = height - padding;
            this.tooltipY = height - (val / max) * chartHeight;
            this.cdr.detectChanges();
        }
    }

    onChartMouseLeave(): void {
        this.hoveredDay = null;
        this.cdr.detectChanges();
    }

    private updateChart(): void {
        if (!this.dashboardData || !this.dashboardData.actividadDiaria.length) {
            this.chartPath = '';
            this.chartLabels = [];
            return;
        }

        const activity = this.dashboardData.actividadDiaria;
        const data = activity.map(d => d.valor);
        const max = Math.max(...data, 1);
        const width = 800;
        const height = 180;
        const padding = 15; // Padding at top
        const chartHeight = height - padding;
        const step = width / (data.length - 1);

        this.chartPath = data.reduce((path, val, i) => {
            const x = i * step;
            const y = height - (val / max) * chartHeight;
            if (i === 0) return `M ${x} ${y}`;
            const prevX = (i - 1) * step;
            const prevY = height - (data[i - 1] / max) * chartHeight;
            const cpX1 = prevX + (x - prevX) / 2;
            const cpY1 = prevY;
            const cpX2 = prevX + (x - prevX) / 2;
            const cpY2 = y;
            return path + ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
        }, '');

        // Show more labels (every 3 days)
        this.chartLabels = [];
        for (let i = 0; i < activity.length; i += 3) {
            const date = new Date(activity[i].fecha);
            this.chartLabels.push(date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }));
        }
        if ((activity.length - 1) % 3 !== 0) {
            const lastDate = new Date(activity[activity.length - 1].fecha);
            this.chartLabels.push(lastDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }));
        }
    }

    get totalActivity(): number {
        if (!this.dashboardData || !this.dashboardData.actividadDiaria) return 0;
        return this.dashboardData.actividadDiaria.reduce((acc, curr) => acc + curr.valor, 0);
    }
}
