
module.exports=(router,dbconnect)=>{

    router.get("/test",(req,res)=>{
        res.status(200).json({done:true});
    })
    router.get("/api/list",async (req,res)=>{
        try{
            console.log("getting list")
            let notes =await dbconnect.find("notes");
            res.status(200).json(notes);
            return;
        }
        catch(err){
            console.error("Error fetching notes",err);
            res.status(500).json({done:false,err:"Error in getting notes"});
        }
    })

   

    return router;
}