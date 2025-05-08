import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() variant: 'default' | 'feature' | 'usage' | 'roadmap' = 'default';
  @Input() hoverEffect = true;
  @Input() centered = false;
}
