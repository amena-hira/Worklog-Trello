import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-delete',
  standalone: false,
  templateUrl: './form-delete.html',
  styleUrl: './form-delete.css',
})
export class FormDelete {
  @ViewChild('delete_modal') deleteModal!: ElementRef<HTMLDialogElement>;

  @Input() itemType: 'task' | 'project' = 'task';
  itemToDelete: any = null;

  @Output() deleted = new EventEmitter<any>();

  
  open(item: any) {
    this.itemToDelete = item;
    this.deleteModal.nativeElement.showModal();
  }

  close() {
    this.deleteModal.nativeElement.close();
  }

  confirmDelete() {
    this.deleted.emit(this.itemToDelete);
    this.close();
  }
}
