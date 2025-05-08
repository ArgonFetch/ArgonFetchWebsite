import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section',
  imports: [CommonModule],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent {
  @Input() id: string = '';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() background: 'dark' | 'darker' = 'dark';
}
