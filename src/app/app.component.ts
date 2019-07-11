import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ImagesService } from "../image/image.service";
import { Image } from "../image/image.model";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'image-upload0at';
  form: FormGroup;
  imagePreview: any;
  images: Image[] = [];
  postsSub: Subscription;
  constructor(
    public imagesService: ImagesService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      image: new FormControl(null)
    });
    // Fetching Images in DB
    this.imagesService.getImages();
    this.postsSub = this.imagesService.getImageUpdateListener()
      .subscribe((images: Image[]) => {
        this.images = images;
      });
  }
  // Showing Preview Before Uploading
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  // Sending Image Value to Service
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.imagesService.addImages(
      this.form.value.image,
    );
      // To get Image Path need to reload, Temp Fix.
    window.location.reload();
  }
  // Sending Delete Call to Service
  onDelete(imageId: string) {
    this.imagesService.deleteImage(imageId);
  }
}

