import { Router } from 'express';
import { asyncHandler, ok } from '../utils/http.js';
import { requireAuth, allowRoles } from '../middleware/auth.js';
import { complaintSchema, idSchema } from '../utils/validation.js';
import { dashboardForCitizen, listCitizenComplaints, getComplaint, createComplaint } from '../services/complaints.js';
import { listNotifications, markNotificationRead, markAllNotificationsRead } from '../services/notifications.js';
import { imageUpload } from '../middleware/upload.js';

const router=Router(); router.use(requireAuth,allowRoles('citizen'));
router.get('/dashboard',asyncHandler(async(req,res)=>ok(res,await dashboardForCitizen(req.user.id))));
router.get('/complaints',asyncHandler(async(req,res)=>ok(res,await listCitizenComplaints(req.user.id,{status:req.query.status,category:req.query.category,q:req.query.q}))));
router.post('/complaints',imageUpload.single('photo'),asyncHandler(async(req,res)=>{const input=complaintSchema.parse(req.body);const url=req.file?`/uploads/${req.file.filename}`:null;ok(res,await createComplaint(req.user.id,input,url),201);}));
router.get('/complaints/:id',asyncHandler(async(req,res)=>{const id=idSchema.parse(req.params.id);const c=await getComplaint(id);if(!c||c.citizenId!==req.user.id) return res.status(404).json({ok:false,error:'Complaint not found.'});ok(res,c);}));
router.get('/notifications',asyncHandler(async(req,res)=>ok(res,await listNotifications(req.user.id))));
router.patch('/notifications/:id/read',asyncHandler(async(req,res)=>ok(res,await markNotificationRead(req.user.id,idSchema.parse(req.params.id)))));
router.post('/notifications/read-all',asyncHandler(async(req,res)=>ok(res,await markAllNotificationsRead(req.user.id))));
export default router;
