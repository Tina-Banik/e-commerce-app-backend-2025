const isAdmin = async(req,res,next)=>{
    try {
        console.log('The req.decode for the admin role :', req.decode.role);
        if(req.decode.role !== 'admin'){
            return res.status(500).json({success:false,message:'Access denied. Only Admin can do this..'})
        }
        next();
    } catch (error) {
        console.error('Error during the admin-info :', error.message);
        return res.status(500).json({success:false,message:'Internal server error..'})
    }
}
const isUser = async(req,res,next)=>{
    try {
        console.log('The req.decode for the user role :', req.decode.role);
        if(req.decode.role !== 'user'){
            return res.status(500).json({success:false,message:'Access denied. Only User can do this..'})
        }
        next();
    } catch (error) {
        console.error('Error during the user info:', error.message);
        return res.status(500).json({success:false,message:'Internal server error'})
    }
}
module.exports = {isAdmin, isUser};
console.log('The admin and user middleware is ready to use..')