import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-gift',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './gift.component.html',
  styleUrl: './gift.component.css'
})
export class GiftComponent {
copyCode(code: string) {
  navigator.clipboard.writeText(code);
  alert(`Coupon code "${code}" copied to clipboard!`);
}

}
