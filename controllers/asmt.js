const executeQuery = require("../model/rdb");

const asmtReport = async (req, res) => {
  
    const {asmt_type} = req.params;
    if(!asmt_type) {
      res.status(404).json({message: 'asmt_type required'});
      return;
    }
  

    // $assessmentsCount = DB::table("asmt_master as am")
    // ->join(user_login as ul,am.uid, =,ul.uid)
    // ->where("am.type", $asmt_type)
    // ->when($corp_id, function ($query,$corp_id) {
    //     $query->where("ul.corp_id",$corp_id);
    // })
    // ->where(am.end_datetime, >=, $startDate)
    // ->where(am.end_datetime,<=, $endDate)
    // ->count();

    
    // const asmtReportQuery = `SELECT * FROM asmt_master am INNER JOIN user_login ul ON am.uid = ul.uid WHERE am.type=${asmt_type}`;
    const asmtReportQuery = `SELECT * FROM asmt_master am INNER JOIN user_login ul ON am.uid = ul.uid INNER JOIN asmt_score a_s ON a_s.asmt_id = am.asmt_id WHERE am.type='${asmt_type}'`;
    // const asmtReportQuery = SELECT * FROM asmt_master LIMIT 100;
    const userData= await executeQuery(asmtReportQuery);


    // const asmtReportQuery2 = `SELECT COUNT(am.asmt_id) as count FROM asmt_master am INNER JOIN user_login ul ON am.uid = ul.uid WHERE am.type='${asmt_type}'`;
    // const asmtReportQuery =  * FROM asmt_masSELECTter LIMIT 100;
    // const userData2= await executeQuery(asmtReportQuery2);
    const response={
        // count:userData2,
        data:userData
    }

    for(let i=0;i<userData.length;i++){
        //do 
        
        
    }

    if(userData.length === 0){
      res.status(404).json({message:'not found'});
      return;
    }
    res.json(response);
  }

  module.exports = {asmtReport};


//   $assessmentsDetailedData = DB::table("asmt_master as am")
//   ->join(user_login as ul,am.uid, =,ul.uid)
//   ->join(user_profile as up,am.uid, =,up.uid)
//   ->join(asmt_score as asc,am.asmt_id, =,asc.asmt_id)
//   ->where("am.type", $asmt_type)
//   ->when($corp_id, function ($query,$corp_id) {
//       $query->where("ul.corp_id",$corp_id);
//   })
//   ->when($case, function ($query1,$case) {
//       $query1->where("asc.level",$case);
//   })
//   ->when($case_scale, function ($query2,$case_scale) {
//       $query2->where("asc.scale",$case_scale);
//   })
//   ->where(am.end_datetime, ">=", $startDate)
//   ->where(am.end_datetime,"<=", $endDate)
//   ->select(am.asmt_id as asmt_id,ul.uid as uid,ul.corp_id as corp_id,ul.email as email,ul.name as name,
//            up.gender as gender,up.yob as yob,ul.mobile as mobile,am.end_datetime as dateTime,asc.scale as scale,
//            asc.level as level,asc.score as score)
//   ->orderBy(asmt_id)
//   ->orderBy(scale)
//   ->get();
