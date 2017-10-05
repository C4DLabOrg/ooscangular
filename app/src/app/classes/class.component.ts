import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ClassService} from './class.service';
import { PromotionsService} from '../promotions/promotions.service';


@Component({
  selector: 'app-classes',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
  providers: [ClassService, PromotionsService]
})
export class ClassComponent implements OnInit, OnDestroy{
  classId: any;
  className: any;
  students: any;
  dt:any;
  promoteStudents:any;
  rows = [];
  children: any[] = this.rows;
  selected: any[];
  count: number = 0;
  offset: number = 0;
  limit: number = 100;
  maleNumber:any;
  femaleNumber:any;
  pm:any;
  promoteError:any;
  table = {
    offset: 0
  };

  columns = [
    { name: 'Name', filtering:{filterString: '', placeholder: 'Filter by name'} },
    { name: 'Gender' },
    {name: 'Guardianphone'},
    { name: 'Enrolled' },

  ];

  constructor(private classService: ClassService,private promotionService: PromotionsService, private router: Router){}

  ngOnInit(){
    this.classId = localStorage.getItem("classId");
    this.promoteStudents = localStorage.getItem("promoteStudents");
    this.getClassData(this.classId);
  }

  ngOnDestroy(){
    localStorage.removeItem('promoteStudents');
    localStorage.removeItem('classId');
  }
  getClassData(id){
    this.classService.getClassId(id).subscribe(data =>{
        console.log(data);
        this.className = data.class_name;

        let streamId = data.id;
        let schoolId = data.school;

        this.getNumberOfMales(schoolId, streamId);
        this.getNumberOfFemales(schoolId, streamId);

        this.classService.getClassStudents(schoolId,streamId).subscribe(data => {
          console.log(data);

           this.count =data.count
          this.students = data.count;
          data = data.results;

          let childs =[]
          let rows=[]
          //  this.count = data.length;
          for (let i = 0;i < data.length;i++){
            this.dt = {}
            this.dt.name=data[i].student_name
            this.dt.gender=data[i].gender
            if(data[i].guardianphone != null){
              this.dt.guardianphone = data[i].guardianphone
            }else{
              this.dt.guardianphone = 'Not Provided'
            }

            this.dt.enrolled = data[i].date_enrolled
            this.dt.id = data[i].id
            childs.push(this.dt)
          }
          this.children = childs;
          this.selected = [];

        }),
        error => {
          //console.log(error);
        }

    }),
    error=>{
      //console.log(error);
    }
  }

  getNumberOfMales(schoolId, streamId){
    this.classService.getClassMaleStudents(schoolId, streamId).subscribe(data => {

      this.maleNumber = data.count;
    }),
    error =>{

    }
  }

  getNumberOfFemales(schoolId, streamId){
    this.classService.getClassFemaleStudents(schoolId, streamId).subscribe(data => {

      this.femaleNumber = data.count;
    }),
    error =>{

    }
  }
  onSelect({ selected }) {
   //console.log('Select Event', selected, this.selected,this.selected[0].id);
   localStorage.setItem('childId', this.selected[0].id);
   this.getChildId(this.selected[0].id);
   //this.router.navigate(['/children/child', this.selected[0].id]);
   }

   private getChildId(id){

     this.router.navigate(['/children/child', id],{skipLocationChange: true});

   }

   promoteAllStudents(){
     let studentIDs = [];
     for(let i=0; i<this.children.length; i++){
       this.pm = {}
       this.pm = this.children[i].id;
       studentIDs.push(this.pm);
     }

     this.promotionService.promoteStudents({
       class_id: this.classId,
       students: studentIDs
     }).subscribe(data=>{
       this.router.navigate(['promoted']);
     },error=>{
       this.promoteError = "Failed to promote. Try again later";
     }
   )}
}
