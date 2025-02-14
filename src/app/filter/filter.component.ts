import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule],
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
  displayedBranches: string[] = []; // Dynamically updates based on selection
  selectedBranches: string[] = []; // Tracks selected branches
  tech : string[] = 
  [
    "Computer Engineering",
    "Computer Science",
    "Computer Science and Engineering",
    "Information Technology",
    "Electronics and Telecommunication Engg",
   "Artificial Intelligence (AI) and Data Science",
    "Industrial IoT",
    "Artificial Intelligence and Data Science",
    "Computer Science and Engineering(Data Science)",
    "Electronics and Computer Engineering",
    "Computer Science and Engineering(Artificial Intelligence and Machine Learning)",
    "VLSI",
    "5G",
    "Computer Science and Design",
    "Mechanical & Automation Engineering",
    "Electronics Engineering",
    "Electronics Engineering ( VLSI Design and Technology)",
    "Artificial Intelligence and Machine Learning",
    "Electrical and Electronics Engineering",
    "Electronics and Computer Science",
   
    "Electronics and Communication(Advanced Communication Technology)",
   
    "Computer Science and Engineering (Internet of Things and Cyber Security Including Block Chain)",
    "Data Science",
    "Cyber Security",
    "Internet of Things (IoT)",
    
    "Computer Science and Engineering(Cyber Security)",
    "Automation and Robotics",
    "Computer Science",
    "Electrical and Computer Engineering",
    "Electronics and Biomedical Engineering",
    "Data Engineering",
    "Computer Technology",
    "Electronics and Communication Engineering",
    "Computer Science and Engineering (Cyber Security)",
    "Computer Science and Engineering (IoT)",
    "Computer Science and Engineering (Artificial Intelligence)",
    "Artificial Intelligence",
    "Bio Technology",
    "Robotics and Artificial Intelligence",
    "Computer Science and Business Systems",
    "Robotics and Automation",
    "Computer Science and Technology",
    "Computer Engineering (Software Engineering)",
    "Computer Science and Information Technology",
    "Computer Science and Engineering (Artificial Intelligence and Data Science)"
  ]
  nontech : string[] = 
  [
    "Instrumentation Engineering",
    "Mechanical Engineering",
    "Safety and Fire Engineering",
    "Mechatronics Engineering",
    "Mechanical and Mechatronics Engineering (Additive Manufacturing)",
    "Electrical Engineering",
    "Civil Engineering",
    "Food Technology",
    "Oil and Paints Technology",
    "Paper and Pulp Technology",
    "Petro Chemical Engineering",
    "Chemical Engineering",
    "Textile Engineering / Technology",
    "Production Engineering",
    "Textile Technology",
    "Pharmaceutical and Fine Chemical Technology",
    "Agricultural Engineering",
    "Plastic and Polymer Engineering",
    "Civil Engineering and Planning",
    "Plastic and Polymer Technology",
    "Petro Chemical Technology",
    "Oil Technology",
    "Aeronautical Engineering",
    "Mining Engineering",
    "Plastic Technology",
    "Oil Fats and Waxes Technology",
    "Paints Technology",
    "Instrumentation and Control Engineering",
    "Civil and infrastructure Engineering",
    "Bio Medical Engineering",
    "Structural Engineering",
    "Civil and Environmental Engineering",
    "Manufacturing Science and Engineering",
    "Metallurgy and Material Technology",
    "Fashion Technology",
    "Man Made Textile Technology",
    "Textile Chemistry",
    "Textile Plant Engineering",
    "Printing Technology",
    "Mechanical Engineering[Sandwich]",
    "Production Engineering[Sandwich]",
    "Fibres and Textile Processing Technology",
    "Polymer Engineering and Technology",
    "Food Engineering and Technology",
    "Surface Coating Technology",
    "Food Technology And Management",
    "Dyestuff Technology",
    "Oil, Oleochemicals and Surfactants Technology",
    "Pharmaceuticals Chemistry and Technology"
  ]
  cet : boolean = false;
  descide(e:any)
  {
      let val :string = e.target.value;
      if(val=="cet") 
      {
        this.cet = true;
      }
      else 
      {
        this.cet= false;
      }
  }
  Minor : boolean = false;
  MinorityChange(e:any)
  {
    let value : string = e.target.value;
    if(value=="Yes")
    {
        this.Minor = true;
    }
    else
    {
        this.Minor = false;
    }

  }
  // selectedLocations: string[] = []; 
  constructor(private dataService: DataService) {}
  ngOnInit() {
    
    this.dataService.getData().subscribe({
      next: (response) => {
        this.data = response;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
    
  }
  selectedRegions: string[] = [];

  regions = 
  [
    { code: '1', name: 'Amravati Division' },
    { code: '2', name: 'Aurangabad Division' },
    { code: '3', name: 'Konkan Division' },
    { code: '4', name: 'Nagpur Division' },
    { code: '5', name: 'Nashik Division' },
    { code: '6', name: 'Pune Division' }
  ];
  liminority :string[] =
  [
    "Un-Aided Linguistic Minority - Hindi" ,
    "Un-Aided Linguistic Minority - Gujarathi(Jain)",
   " Un-Aided Autonomous Linguistic Minority - Hindi",     
    " Un-Aided Linguistic Minority - Sindhi",
    "Un-Aided Autonomous Linguistic Minority - Sindhi",    
     "Un-Aided Autonomous Linguistic Minority - Gujarathi",
     "Un-Aided Autonomous Linguistic Minority - Malyalam"  ,
     "Un-Aided Linguistic Minority - Punjabi",
      "Un-Aided Linguistic Minority - Tamil",                
     "Un-Aided Linguistic Minority - Malyalam",             
      "Un-Aided Linguistic Minority - Gujarathi",
      " Un-Aided Linguistic Minority - Gujar"   ,
      "Un-Aided Religious Minority - Muslim",
  "Un-Aided Religious Minority - Christian",
  "Un-Aided Religious Minority - Roman Catholics",
   "Un-Aided Religious Minority - Jain",                  
   "Un-Aided Autonomous Religious Minority - Christian" ,
  "Un-Aided Autonomous Religious Minority - Jain"            
  ];
  reminority:string[] =
[
  
];
  onRegionChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const code = checkbox.value;
    if (checkbox.checked) {
      this.selectedRegions.push(code);
    } else {
      this.selectedRegions = this.selectedRegions.filter((region) => region !== code);
    }
  }
  selectedBranch: string | null = null; // Tracks selected radio button
  selectedTechBranches: string[] = []; // Tracks selected tech branches
  onBranchSelection(branchType: string) {
    this.selectedBranch = branchType;

    if (branchType === 'tech') {
      this.displayedBranches = [...this.tech];
    } else if (branchType === 'nontech') {
      this.displayedBranches = [...this.nontech];
    } else if (branchType === 'both') {
      this.displayedBranches = [...this.tech, ...this.nontech];
    }

    if (branchType === 'both') {
      this.selectedBranches = [...this.displayedBranches];
    } else {
      this.selectedBranches = []; // Reset previously selected branches
    }
  }

  onBranchChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedBranches.push(checkbox.value); // Add selected branch
    } else {
      this.selectedBranches = this.selectedBranches.filter(
        (branch) => branch !== checkbox.value
      ); // Remove unselected branch
    }
    console.log('Selected Branches:', this.selectedBranches);
  }

selectedMinority : string[] =[];
onMinorityChange(event: any): void {
  let typeMinority: string[] = []; 

  if (event.target.checked) {
    typeMinority.push(event.target.value); 

    this.selectedMinority = [
      ...new Set([...this.selectedMinority, ...typeMinority]),
    ];
  } else {
    typeMinority.push(event.target.value); // Assuming `event.target.value` holds the desired value

    this.selectedMinority = this.selectedMinority.filter(
      (location) => !typeMinority.includes(location)
    );
  }
}


  filterColleges() 
  {
    if (this.caste && this.percentile !== null && this.cet == true) 
      {
      this.dataService
        .getFilteredColleges(this.caste, this.percentile, this.selectedBranches, this.selectedCities,this.selectedMinority) // Pass branch filter
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
    if(this.percentile !== null && this.cet==false)
    {
      this.dataService
      .getFilteredCollegesj( this.percentile, this.selectedBranches, this.selectedCities) // Pass branch filter
      .subscribe({
        next: (data) => 
          {
          this.colleges = data;
          console.log('Filtered data:', this.colleges);
        },
        error: (err) => {
          console.error('Error fetching filtered data:', err);
        },
      });
    }
    
  }



downloadPDF() {
  const doc = new jsPDF();

  // Title
  doc.text('Filtered College Data', 14, 20);

  // Table
  autoTable(doc, {
    startY: 30,
    head: [
      ['Sr No', 'College Code', 'College Name', 'Branch', 'Minority', 'Location', 'OBC', 'OPEN'],
    ],
    body: this.colleges.map((college) => [
      college['Sr No'],
      college['College Code'],
      college['College Name'],
      college['Branch'],
      college['Minority'],
      college['Location'],
      college['OPEN']
      ]),
  });

  // Save the PDF
  doc.save('Filtered_Colleges.pdf');
}
amravatiDivision:string[] = [
  "Amravati", "Yavatmal", "Shegaon", "Akola", "Pusad", "Chikhali", 
  "Buldhana", "Badnera", "Yelgaon", "Washim", "Nile"
];

konkan :string[]= [
  "Mumbai", "Andheri", "Lonere", "Ratnagiri", "Navi Mumbai", "Karjat", 
  "Kharghar Navi Mumbai", "Vasai", "Deorukh", "Kankavli", "New Panvel", 
  "Thane", "ULHASNAGAR", "Palghar", "Shahapur", "Shirgaon", "Boisar", 
  "Tal. Khalapur. Dist. Raigad", "Bhayinder (E) Western Rly", 
  "Badlapur(W)", "Tal-Ambernath.", "Panvel", "Sindhudurg", 
  "Atma Malik Institute Of Technology & Research", "Raigad", 
  "Kaman Dist. Palghar", "Dist.Thane", "Khalapur Dist Raigad", 
  "Bapsai Tal.Kalyan"
];

nashik :string[]= [
  "Jalgaon", "Dhule", "Nashik", "Babulgaon", "Chincholi Dist. Nashik", 
  "Ahmednagar", "Kopargaon", "Sangamner", "Dist. Nandurbar", 
  "Faizpur", "Tal Dist Dhule", "Bhusawal", "Shirpur", "(Nashik)", 
  "Agaskhind Tal. Sinnar", "Adgaon Nashik", "Akkalkuwa", 
  "Chas Dist. Ahmednagar", "Dondaicha", "Nepti", "Bota Sangamner", 
  "Dist.Ahmednagar", "Malegaon", "Nandurbar"
];

pune :string[]= [
  "Avasari Khurd", "Karad", "Pune", "Sangli", "Kolhapur", "Dist-Pune", 
  "Narhe (Ambegaon)", "Bhima", "Haveli", "Ashokrao Mane Group of Institutions", 
  "Solapur", "Pandharpur", "Ichalkaranji", "Warananagar", "Satara", 
  "Malegaon-Baramati", "Jaysingpur", "Baramati Dist.Pune", "Tal. Haveli", 
  "Solapur(North)", "Wagholi", "Kille Macchindragad Tal. Walva District- Sangali", 
  "Panhala", "Yadrav(Ichalkaranji)", "Wadwadi", "Tal. Indapur", "Pisoli", 
  "Dumbarwadi", "Bhor", "Kuran", "Sasewadi", "Swami - Chincholi Tal. Daund Dist. Pune", 
  "Post Belhe Tal. Junnar Dist. Pune", "Korti Tal. Pandharpur Dist Solapur", 
  "Miraj", "Sangola", "Barshi", "Akluj", "Someshwar Nagar", "Gadhinglaj", 
  "Lonavala", "Ravet", "Talegaon"
];

aurangabad :string[]= [
  "Aurangabad", "Nanded", "Jalna", "Ohar", "Latur", "Osmanabad", 
  "Tuljapur", "Ambejogai", "Beed", "Parbhani", "(ICEEM)"
];

nagpur :string[]= [
  "Chandrapur", "Nagpur", "Ramtek", "Sevagram", "Bhandara", "Wardha", 
  "Mouza Bamni", "Bhadrawati", "Sindhi(Meghe)", "Dist Wardha"
];
regionList = ['Nagpur', 'Amravati', 'Konkan', 'Nashik', 'Pune', 'Aurangabad'];
locationMap: { [key: string]: string[] } = {
  'Nagpur': this.nagpur,
  'Amravati': this.amravatiDivision,
  'Konkan': this.konkan,
  'Nashik': this.nashik,
  'Pune': this.pune,
  'Aurangabad': this.aurangabad
};
regionSelections: { [key: string]: string[] } = {
  'Nagpur': [],
  'Amravati': [],
  'Konkan': [],
  'Nashik': [],
  'Pune': [],
  'Aurangabad': []
};
selectedRegions1: string[] = [];

// To track selected locations for each region
selectedLocations: { [key: string]: string[] } = {};

// To hold the final list of selected cities across all regions
selectedCities: string[] = [];

// Handle region checkbox change
onRegionChange1(regionName: string) {
  if (this.selectedRegions1.includes(regionName)) {
    // If region is already selected, unselect it
    this.selectedRegions1 = this.selectedRegions1.filter(region => region !== regionName);
    delete this.selectedLocations[regionName]; // Remove cities for unselected region
  } else {
    // If region is not selected, add it
    this.selectedRegions1.push(regionName);
    this.selectedLocations[regionName] = []; // Initialize an empty array for locations
  }

  // Update selected cities
  this.updateSelectedCities();
}

// Handle city checkbox change
onCityChange(regionName: string, location: string) {
  const locations = this.selectedLocations[regionName];
  if (locations.includes(location)) {
    // If city is already selected, unselect it
    this.selectedLocations[regionName] = locations.filter(loc => loc !== location);
  } else {
    // If city is not selected, add it
    this.selectedLocations[regionName].push(location);
  }

  // Update selected cities
  this.updateSelectedCities();
}

// Update the final list of selected cities across all regions
updateSelectedCities() {
  this.selectedCities = [];
  for (const region of this.selectedRegions1) {
    this.selectedCities.push(...this.selectedLocations[region]);
  }
}
}
