import { Component } from '@angular/core';
import { LucideAngularModule, Minus, Square, X, ArrowUpRight } from 'lucide-angular';

@Component({
    selector: 'app-screenshots',
    imports: [LucideAngularModule],
    templateUrl: './screenshots.component.html',
    styleUrl: './screenshots.component.scss'
})
export class ScreenshotsComponent {
    readonly MinusIcon = Minus;
    readonly SquareIcon = Square;
    readonly XIcon = X;
    readonly ArrowUpRightIcon = ArrowUpRight;
}
