
export interface createIndustry{
    industryName:string
    industryImage:string
  }

export interface industry{
  industryID: string,
  industryName:string,
  industryImage: string
}

export interface industryResponse{
  industries: [
    {
      industryID: string,
      isDeleted: string,
      industryName:string,
      industryImage: string
    }
  ]

  }

  export interface sector{
    industryID:string
    sectorName:string
    sectorDescription:string
  }