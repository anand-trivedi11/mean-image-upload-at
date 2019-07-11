import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { Image } from "./image.model";

@Injectable({ providedIn: "root" })
export class ImagesService {
  private images: Image[] = [];
  private imagesUpdated = new Subject<Image[]>();

  constructor(private http: HttpClient, private router: Router) { }
  // Fetching Images
  getImages() {
    this.http
      .get<{ message: string; images: any }>("http://localhost:3000/api/images")
      .pipe(
        map(imageData => {
          return imageData.images.map(image => {
            return {
              id: image._id,
              imagePath: image.imagePath
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.images = transformedPosts;
        this.imagesUpdated.next([...this.images]);
      });
  }

  getImageUpdateListener() {
    return this.imagesUpdated.asObservable();
  }
// Adding Images
  addImages(image: File) {
    const imageData = new FormData();

    imageData.append("image", image);
    this.http
      .post<{ message: string; image: Image }>(
        "http://localhost:3000/api/images",
        imageData
      )
      .subscribe(responseData => {
        const image: Image = {
          id: responseData.image.id,

          imagePath: responseData.image.imagePath
        };
        this.images.push(image);
        this.imagesUpdated.next([...this.images]);
        // this.router.navigate(["/"]);
      });
  }
  // Deleting Image by ID
  deleteImage(imageId: string) {
    this.http
      .delete("http://localhost:3000/api/images/" + imageId)
      .subscribe(() => {
        const updatesImages = this.images.filter(post => post.id !== imageId);
        this.images = updatesImages;
        this.imagesUpdated.next([...this.images]);
      });
  }
}
