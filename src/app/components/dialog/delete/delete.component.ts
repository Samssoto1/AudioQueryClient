import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  canDelete: boolean;

  constructor(private matDialogRef: MatDialogRef<DeleteComponent>, @Inject(MAT_DIALOG_DATA) public data: {type: string}) { }

  ngOnInit(): void {
    
  }

  ngOnDestroy(){
    this.matDialogRef.close(this.canDelete);
  }

}
