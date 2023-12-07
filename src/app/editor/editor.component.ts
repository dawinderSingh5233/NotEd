import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import Quill from 'quill';
import { Page } from '../models/dataModels';
import { HttpClient } from '@angular/common/http';
import {
  AddPageDataResponse,
  GetPageDataResponse,
} from '../models/responseModels';
import { environment } from 'src/environments/environment';
import { Buffer } from 'buffer';
import { AddPageDataRequest } from '../models/requestModels';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit, AfterViewInit {
  isLoading: boolean = false;
  quillEditor!: Quill;
  pageContent!: string;

  @Input() pageData!: Page;
  @ViewChild('editorPane') editorPane!: ElementRef<HTMLDivElement>;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  ngOnInit(): void {
    let url =
      environment.apiUrl + environment.getPageData + '/' + this.pageData.pageId;

    this.http.get<GetPageDataResponse>(url).subscribe((response) => {
      if (response.statusCode === 200) {
        if (response.pageData) {
          let base64Data = response.pageData;
          let jsonData = Buffer.from(base64Data, 'base64').toString();
          let data = JSON.parse(jsonData);
          this.quillEditor.setContents(data);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.quillEditor = new Quill(this.editorPane.nativeElement, {
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'link'],
          [{ list: 'ordered' }, { list: 'bullet' }, 'code'],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
        ],
      },
      placeholder: 'Start Taking notes...',
      theme: 'snow', // or 'bubble' or 'snow'
    });
  }

  onSave() {
    let data = this.quillEditor.getContents();
    let strData = JSON.stringify(data);
    let base64Str = Buffer.from(strData).toString('base64');

    let url = environment.apiUrl + environment.addPageData;
    let body: AddPageDataRequest = {
      pageId: this.pageData.pageId,
      dataFile: base64Str,
    };

    this.http.post<AddPageDataResponse>(url, body).subscribe((response) => {
      if (response.statusCode === 200) {
        this.toastService.createNewToast('Success', 'Page Data Updated');
      } else {
        this.toastService.createNewToast('Error', 'Something went wrong!');
      }
    });
  }
}
