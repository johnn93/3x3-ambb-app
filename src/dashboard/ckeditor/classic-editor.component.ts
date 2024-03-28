import {Component, Input} from '@angular/core';
// @ts-ignore
import * as customBuild from './build/ckeditor'

@Component({
  selector: 'app-ckeditor',
  templateUrl: './classic-editor.component.html',
  styleUrls: ['./classic-editor.component.scss']
})
export class ClassicEditorComponent {
  @Input() data: any;
  @Input() control: any;
  Editor = customBuild
}
