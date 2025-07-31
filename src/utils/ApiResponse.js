class ApiResponse {
      constructor(
            statusCode , 
            message = "success" , 
            data = null , 


      ){
         this.statusCode = statusCode ; 
         this.message = message ; 
         this.success = statusCode < 400 ; 
         this.data = data

      }
}

export { ApiResponse }