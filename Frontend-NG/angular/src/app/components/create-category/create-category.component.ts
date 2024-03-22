import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServiceService } from '../../services/user-service.service';
import { HttpClient } from '@angular/common/http';
import { GigsService } from '../../services/gigs.service';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent {
  industryForm!: FormGroup;
  visible = false;
  visible2 = false;
  errorMsg!: string;
  successMsg!: string;
  isLoading!:Boolean
imgUrl: string | null = null
imageUpload:any[] = []

  constructor(private fb: FormBuilder, public industryService:GigsService, private http:HttpClient) {
    this.industryForm = this.fb.group({
      industryName: ['', Validators.required],
      industryImage: ['', Validators.required]
    });
  }

  // onSubmit() {
  //   this.industryService.createIndustry(this.industryForm.value.industryName, this.industryForm.value.industryImage).subscribe(
  //     (response) => {
  //       this.successMsg = "Industry created successfully!";
  //       this.visible2 = true;
  //       // Clear form after successful submission
  //       this.industryForm.reset();
  //       console.log('Industry created successfully!');
  //     },
  //     (error) => {
  //       this.errorMsg = "Error occurred while creating industry.";
  //       this.visible = true;
  //     }
  //   );
    
async uploadImage(event: any){
  this.isLoading = true

        
  const target = event.target
  const files = target.files
  if(files){
      console.log(files)
      const formData = new FormData()
      formData.append("file", files[0])
      formData.append("upload_preset", "shopieProductImageUploads")
      formData.append("cloud_name", "dioueb86u")

        console.log(formData);
        
        
        
        await fetch('https://api.cloudinary.com/v1_1/dioueb86u/image/upload', {
          method: "POST",
          body: formData
        }).then(
          (res:any) => {
            
            return res.json()  
          },
          
        ).then(data=>{
          this.isLoading = true
          console.log("this is the URL",data.url);
          this.industryForm.get('image')?.setValue(data.url)
          return data.url = this.imgUrl;
          
        }
        );


  }

}



 addIndustry(){
  console.log(this.industryForm.value);
  


  const postedData =  this.industryForm.value
  console.log("data sent",postedData);
     

  
  this.industryService.createIndustry(postedData).subscribe(
    res =>{
      console.log(res);  
      
      if(res.error){
        this.visible = true
        this.errorMsg = res.error

        setTimeout(() => {
          this.visible = false
        }, 3000);
      }else if(res.message){
        this.visible2 = true
        this.successMsg = res.message        

        setTimeout(() => {
          this.visible2 = false
        }, 3000);


    }
    
},
error=>{
  console.error(error);
})

  this.industryForm.reset()

}  
  }

