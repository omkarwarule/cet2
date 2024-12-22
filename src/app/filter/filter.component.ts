import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,HttpClientModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
  providers :[DataService]
})
export class FilterComponent 
{
  data: any[] = [];
  caste = '';
  branch = ''; 
  percentile: number | null = null;
  colleges: any[] = [];
 ballocations: string[] = [
    "5G",
    "Aeronautical Engineering",
    "Agricultural Engineering",
    "Artificial Intelligence",
    "Artificial Intelligence (AI) and Data Science",
    "Artificial Intelligence and Data Science",
    "Artificial Intelligence and Machine Learning",
    "Automation and Robotics",
    "Bio Medical Engineering",
    "Bio Technology",
    "Chemical Engineering",
    "Civil and Environmental Engineering",
    "Civil and Infrastructure Engineering",
    "Civil Engineering",
    "Civil Engineering and Planning",
    "Computer Engineering",
    "Computer Engineering (Software Engineering)",
    "Computer Science",
    "Computer Science and Business Systems",
    "Computer Science and Design",
    "Computer Science and Engineering",
    "Computer Science and Engineering (AI and Data Science)",
    "Computer Science and Engineering (Artificial Intelligence)",
    "Computer Science and Engineering (Artificial Intelligence and Data Science)",
    "Computer Science and Engineering (Cyber Security)",
    "Computer Science and Engineering (IoT)",
    "Computer Science and Engineering (Internet of Things and Cyber Security Including Block Chain)",
    "Computer Science and Engineering (Artificial Intelligence and Machine Learning)",
    "Computer Science and Information Technology",
    "Computer Science and Technology",
    "Computer Technology",
    "Cyber Security",
    "Data Engineering",
    "Data Science",
    "Dyestuff Technology",
    "Electrical and Computer Engineering",
    "Electrical and Electronics Engineering",
    "Electrical Engineering",
    "Electrical Engineering [Electrical and Power]",
    "Electrical Engineering [Electronics and Power]",
    "Electronics and Biomedical Engineering",
    "Electronics and Communication (Advanced Communication Technology)",
    "Electronics and Communication Engineering",
    "Electronics and Computer Engineering",
    "Electronics and Computer Science",
    "Electronics and Telecommunication Engg",
    "Electronics Engineering",
    "Electronics Engineering (VLSI Design and Technology)",
    "Fashion Technology",
    "Fibres and Textile Processing Technology",
    "Food Engineering and Technology",
    "Food Technology",
    "Food Technology And Management",
    "Industrial IoT",
    "Information Technology",
    "Instrumentation and Control Engineering",
    "Instrumentation Engineering",
    "Internet of Things (IoT)",
    "Logistics",
    "Man Made Textile Technology",
    "Manufacturing Science and Engineering",
    "Mechanical & Automation Engineering",
    "Mechanical and Mechatronics Engineering (Additive Manufacturing)",
    "Mechanical Engineering",
    "Mechanical Engineering [Sandwich]",
    "Mechatronics Engineering",
    "Metallurgy and Material Technology",
    "Mining Engineering",
    "Oil and Paints Technology",
    "Oil Fats and Waxes Technology",
    "Oil Technology",
    "Oil, Oleochemicals and Surfactants Technology",
    "Paints Technology",
    "Paper and Pulp Technology",
    "Petro Chemical Engineering",
    "Petro Chemical Technology",
    "Pharmaceutical and Fine Chemical Technology",
    "Pharmaceuticals Chemistry and Technology",
    "Plastic and Polymer Engineering",
    "Plastic and Polymer Technology",
    "Plastic Technology",
    "Polymer Engineering and Technology",
    "Printing Technology",
    "Production Engineering",
    "Production Engineering [Sandwich]",
    "Robotics and Artificial Intelligence",
    "Robotics and Automation",
    "Safety and Fire Engineering",
    "Structural Engineering",
    "Surface Coating Technology",
    "Textile Chemistry",
    "Textile Engineering / Technology",
    "Textile Plant Engineering",
    "Textile Technology",
    "VLSI"
  ];
  
  allLocations: string[] = [
    'Mumbai', 'Amravati', 'Aurangabad', 'Nagpur', 'Pune',
    'Jalgaon', 'Kolhapur', 'Yavatmal', 'Karad', 'Awasari Khurd', 'Bambhori Pr. Chandsar'
  ];
  selectedLocations: string[] = []; 
  selectedBranches: string[] = [];
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getData().subscribe({
      next: (response) => {
        this.data = response;
        console.log(this.ballocations.length);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }
  onCheckboxChange2(event: any): void 
  {
    const br = event.target.value;
    if (event.target.checked) 
    {
      this.selectedBranches.push(br);
    } else 
    {
      const index = this.selectedBranches.indexOf(br);
      if (index !== -1) 
      {
        this.selectedBranches.splice(index, 1);
      }
    }
  }
  onCheckboxChange(event: any): void 
  {
    const location = event.target.value;
    if (event.target.checked) 
    {
      this.selectedLocations.push(location);
    } else 
    {
      const index = this.selectedLocations.indexOf(location);
      if (index !== -1) 
      {
        this.selectedLocations.splice(index, 1);
      }
    }
  }

  filterColleges() {
    if (this.caste && this.percentile !== null) {
      this.dataService
        .getFilteredColleges(this.caste, this.percentile, this.selectedBranches, this.selectedLocations) // Pass branch filter
        .subscribe({
          next: (data) => {
            this.colleges = data;
            console.log('Filtered data:', data);
          },
          error: (err) => {
            console.error('Error fetching filtered data:', err);
          },
        });
    }
  }
}
