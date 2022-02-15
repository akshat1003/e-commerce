const Order=require('../models/order')
const Product=require('../models/product')
const ErrorHandler=require('../utils/errorHandler')
const catchAsyncError=require('../middlewares/catchAsyncErrors')


//create a new order /api/v1/order/new
exports.newOrder=catchAsyncError(async(req,res,next) => {
    const {
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,totalPrice,paymentInfo

    }=req.body;
    const order=Order.create({
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,totalPrice,paymentInfo,
        paidAt:Date.now(),
        user:req.user._id
    })
    res.status(200).json({
        success: true,
        order
    })
})

// get single order /api/v1/order/:id
exports.getSingleOrder=catchAsyncError(async(req,res,next) => {
   const order=await Order.findById(req.params.id).populate('user','name email');
   if(!order) {
       return next(new ErrorHandler('No Order found with this id'))
   }
    res.status(200).json({
        success: true,
        order
    })
})
//get logged in user orders     /orders/me

exports.myOrders=catchAsyncError(async(req,res,next) => {
    const order=await Order.find({user:req.user.id});
    if(!order) {
        return next(new ErrorHandler('No Order found with this id'))
    }
     res.status(200).json({
         success: true,
         order
     })
 })


// get all orders    /admin/order


exports.allOrders=catchAsyncError(async(req,res,next) => {
    const orders=await Order.find();
    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    })
     res.status(200).json({
         success: true,
         totalAmount,
         orders
     })
 })






// Update/Process orders    /admin/order/:id


exports.updateOrder=catchAsyncError(async(req,res,next) => {
    const order=await Order.findById(req.params.id);
    if(order.orderStatus==='Delivered')
    {
        return next(new ErrorHandler('You have already delivered this order',400))
    }

    order.orderItems.forEach(async item=>{
        await updateStock(item.product,item.quantity)
    })

    order.orderStatus=req.body.status,
    order.deliveredAt=Date.now()

    await order.save()
     res.status(200).json({
         success: true
     })
 })


async function updateStock(id,quantity){
    const product=await Product.findById(id);
    product.stock=product.stock-quantity;
    await product.save({validateBeforeSave:false})
}





//Delete orders    /admin/order/:id


exports.deleteOrder=catchAsyncError(async(req,res,next) => {
    const order=await Order.findById(req.params.id);
    if(!order)
    {
        return next(new ErrorHandler('No order found with this ID',404))
    }
    await order.remove()
     res.status(200).json({
         success: true
     })
 })











 



















